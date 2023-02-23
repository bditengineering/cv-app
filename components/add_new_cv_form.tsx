"use client";

import supabase from "../utils/supabase_browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Projects from "./cv_form/projects";
import TechnicalSkill from "./cv_form/technical_skill";
import { Education } from "./cv_form/education";
import { EnglishLevel } from "./cv_form/english_level";
import { PersonalInfo } from "./cv_form/personal_info";
import { AdditionalInfo } from "./cv_form/additional_info";
import type {
  Project,
  Certificate,
  Education as EducationType,
  CV,
} from "../utils/types";

interface Props {
  id?: string;
}

export default function AddNewCvForm({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CV>({
    first_name: "",
    last_name: "",
    summary: "",
    education: {
      university_name: "",
      start_year: "",
      end_year: "",
      degree: "",
    },
    english_written_level: "",
    english_spoken_level: "",
    projects: [],
    certifications: [],
    personal_qualities: [],
    technical_skills: [],
  });
  const [serverErrorMessage, setServerErrorMessage] = useState<string>();

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    english_spoken_level: Yup.string().required("Please select a level"),
    english_written_level: Yup.string().required("Please select a level"),
  });

  async function fetchCv(employeeId: string) {
    const { data } = await supabase
      .from("cv")
      .select("*, projects(*), education(*), certifications(*)")
      .eq("id", employeeId);

    if (!data) return;

    const updatedProjects = data[0].projects.map((project: Project) => {
      return {
        ...project,
        date_start: new Date(project.date_start),
        date_end: new Date(project.date_end),
      };
    });

    const formData = {
      ...data[0],
      projects: updatedProjects,
      education: data[0].education[0],
    };

    setForm(formData);
  }

  async function uploadPdf(fileName: string) {
    const response = await fetch("/api/upload_to_drive", {
      method: "POST",
      body: JSON.stringify({ fileName: fileName }),
    });
    return response.ok;
  }

  async function edgeUploadInvocation(cvId: string) {
    const response = await supabase.functions.invoke("upload-to-storage", {
      body: { id: cvId },
    });
    return response;
  }

  async function upsert(values: CV) {
    const updatedCv = { ...values } as Partial<CV>;

    if (!id) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      updatedCv.created_by = session?.user.id;
    }

    delete updatedCv.projects;
    delete updatedCv.certifications;
    delete updatedCv.education;

    return supabase.from("cv").upsert(updatedCv).select();
  }

  async function upsertCertifications(
    certifications: Certificate[],
    cvId: string,
  ) {
    if (certifications.length === 0) {
      return await supabase.from("certifications").delete().eq("cv_id", cvId);
    }

    const updatedCertifications = certifications.map(
      (certification: Certificate) => ({
        ...certification,
        cv_id: cvId,
      }),
    );
    return supabase.from("certifications").upsert(updatedCertifications);
  }

  async function upsertEducation(education: EducationType, cvId: string) {
    education.cv_id = cvId;
    return supabase.from("education").upsert(education);
  }

  async function upsertProjects(projects: Project[], cvId: string) {
    if (projects.length === 0) {
      return await supabase.from("projects").delete().eq("cv_id", cvId);
    }

    const updatedProjects = projects.map((project: Project) => {
      const startDate = new Date(project.date_start);
      startDate.setDate(15);

      const endDate = new Date(project.date_end);
      endDate.setDate(15);
      return {
        ...project,
        cv_id: cvId,
        date_start: startDate.toISOString(),
        date_end: endDate.toISOString(),
      };
    });

    return supabase.from("projects").upsert(updatedProjects);
  }

  async function handleSubmit(values: CV) {
    const { data, error } = await upsert(values);
    setServerErrorMessage(error ? error.message : "");

    if (error) {
      setServerErrorMessage(error.message);
    } else {
      await router.push("/");
    }

    if (!data) return;
    const cvId = data[0].id;

    if (values.education) {
      const { error } = await upsertEducation(values.education, cvId);
      if (error) {
        setServerErrorMessage(error ? error.message : "");
        return;
      }
    }

    if (values.certifications) {
      const { error } = await upsertCertifications(values.certifications, cvId);
      if (error) {
        setServerErrorMessage(error ? error.message : "");
        return;
      }
    }

    if (values.projects) {
      const { error } = await upsertProjects(values.projects, cvId);
      if (error) {
        setServerErrorMessage(error ? error.message : "");
        return;
      }
    }

    const storageUploadResponse = await edgeUploadInvocation(cvId);

    if (!storageUploadResponse.error) {
      const fileName = values.first_name + "-" + values.last_name + "-CV";
      const uploadsuccessful = await uploadPdf(fileName);
      if (!uploadsuccessful) {
        setServerErrorMessage(
          "An error occured while uploading to google drive",
        );
        return;
      }
    }

    router.push("/");
  }

  useEffect(() => {
    if (id) {
      fetchCv(id);
    }
  }, [id]);

  return (
    <Formik
      initialValues={{ ...form }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
      enableReinitialize
    >
      {(formProps) => (
        <Form>
          <div className="body-font overflow-hidden rounded-md border-2 border-gray-200 dark:border-gray-700 text-gray-600">
            <div className="container mx-auto px-16 py-24">
              <PersonalInfo />
              <TechnicalSkill formProps={formProps} />
              <Projects formProps={formProps} />
              <Education />
              <EnglishLevel />
              <AdditionalInfo formProps={formProps} />

              <button
                className="mt-20 rounded-md bg-indigo-500 p-5 text-white hover:bg-indigo-600 w-full"
                type="submit"
              >
                Submit
              </button>
              {serverErrorMessage && <p>Error: {serverErrorMessage}</p>}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

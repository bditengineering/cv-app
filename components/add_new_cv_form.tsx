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
import * as Types from "../types";

interface Props {
  id?: string;
}

export default function AddNewCvForm({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Types.FullCv<"Row" | "Insert" | "Update">>({
    first_name: "",
    last_name: "",
    summary: "",
    education: [
      // {
      //   university_name: "",
      //   start_year: null,
      //   end_year: null,
      //   degree: "",
      // },
    ],
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
      .eq("id", employeeId)
      .returns<Types.FullCv>();

    if (!data) return;

    const updatedProjects = data[0].projects.map((project) => {
      return {
        ...project,
        date_start: project.date_start
          ? new Date(project.date_start)
          : project.date_start,
        date_end: project.date_end
          ? new Date(project.date_end)
          : project.date_end,
      };
    });

    const formData = {
      ...data[0],
      projects: updatedProjects,
      education: data[0].education,
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

  async function upsert(values: Types.FullCv<"Insert" | "Update">) {
    const updatedCv: Partial<typeof values> = { ...values };

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
    certifications: Types.Certification<"Insert" | "Update">[],
    cvId: string,
  ) {
    if (certifications.length === 0) {
      return await supabase.from("certifications").delete().eq("cv_id", cvId);
    }

    const updatedCertifications = certifications.map(
      (certification: Types.Certification<"Update">) => ({
        ...certification,
        cv_id: cvId,
      }),
    );
    return supabase.from("certifications").upsert(updatedCertifications);
  }

  // check if education should be array or single item
  async function upsertEducation(
    education: Types.Education<"Insert" | "Update">[],
    cvId: string,
  ) {
    education[0].cv_id = cvId;
    return supabase.from("education").upsert(education);
  }

  async function upsertProjects(
    projects: Types.Project<"Update">[],
    cvId: string,
  ) {
    if (projects.length === 0) {
      return await supabase.from("projects").delete().eq("cv_id", cvId);
    }

    const updatedProjects = projects.map((project: Types.Project<"Update">) => {
      let dateStart = project.date_start;
      if (dateStart) {
        const dateStartAsDate = new Date(dateStart);
        dateStartAsDate.setDate(15);
        dateStart = dateStartAsDate.toISOString();
      }

      let dateEnd = project.date_end;
      if (dateEnd) {
        const dateEndAsDate = new Date(dateEnd);
        dateEndAsDate.setDate(15);
        dateEnd = dateEndAsDate.toISOString();
      }

      return {
        ...project,
        cv_id: cvId,
        date_start: dateStart,
        date_end: dateEnd,
      };
    });

    return supabase.from("projects").upsert(updatedProjects);
  }

  async function handleSubmit(values: Types.FullCv<"Insert" | "Update">) {
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

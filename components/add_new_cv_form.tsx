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
import type { CvSkillResponse, SkillGroup, TitlesResponse } from "./types";

type FormSkill = {
  id: string | null;
  cv_id?: string;
  skill_id: string;
};

interface Props {
  id?: string;
  skills: SkillGroup;
  titles: Array<TitlesResponse>;
}

export default function AddNewCvForm({ id, skills, titles }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<any>>({
    first_name: "",
    last_name: "",
    title_id: "",
    summary: "",
    educations: [],
    english_written_level: "",
    english_spoken_level: "",
    projects: [],
    certifications: [],
    personal_qualities: [],
    cv_skill: [],
  });
  const [initialUserSkills, setInitialUserSkills] = useState<
    Array<CvSkillResponse>
  >([]);
  const [serverErrorMessage, setServerErrorMessage] = useState<string>();
  const [educationsToRemove, setEducationsToRemove] = useState<Array<string>>(
    [],
  );
  const [projectsToRemove, setProjectsToRemove] = useState<Array<string>>([]);
  const [certificationsToRemove, setCertificationsToRemove] = useState<
    Array<string>
  >([]);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      fetchCv(id);
    }
  }, [id]);

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    title_id: Yup.string().required("Title is required"),
    english_spoken_level: Yup.string().required("Please select a level"),
    english_written_level: Yup.string().required("Please select a level"),
    summary: Yup.string().required("Summary is required"),
    projects: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Project name is required"),
          description: Yup.string().required("Project description is required"),
          technologies: Yup.array()
            .of(Yup.string())
            .min(1, "Technologies & Tools on project are required"),
          responsibilities: Yup.array()
            .of(Yup.string())
            .min(1, "Responsibilities on project are required"),
        }),
      )
      .min(1, "You must have at least one project"),
    educations: Yup.array().of(
      Yup.object().shape({
        university_name: Yup.string().required("University name is required"),
        degree: Yup.string().required("Degree is required"),
        start_year: Yup.string().required("Start year is required"),
        end_year: Yup.string().required("End year is required"),
      }),
    ),
    certifications: Yup.array().of(
      Yup.object().shape({
        certificate_name: Yup.string().required("Certificate name is required"),
        description: Yup.string().required("Description is required"),
      }),
    ),
  });

  async function fetchCv(employeeId: string) {
    const { data } = await supabase
      .from("cv")
      .select(
        "*, projects(*), educations(*), certifications(*), titles(*), cv_skill(*)",
      )
      .eq("id", employeeId);

    if (!data) return;

    setInitialUserSkills(data[0].cv_skill);

    const updatedProjects = data[0].projects.map((project: any) => {
      return {
        ...project,
        team_size: project.team_size || "",
        date_start: project.date_start ? new Date(project.date_start) : "",
        date_end: project.date_end ? new Date(project.date_end) : "",
      };
    });

    const formData = {
      ...data[0],
      projects: updatedProjects,
      educations: data[0].educations,
    };

    setForm(formData);
    setLoading(false);
  }

  async function uploadPdf(fileName: string, folderName: string) {
    const response = await fetch("/api/upload_to_drive", {
      method: "POST",
      body: JSON.stringify({ fileName: fileName, folderName: folderName }),
    });
    return response.ok;
  }

  async function edgeUploadInvocation(cvId: string) {
    const response = await supabase.functions.invoke("upload-to-storage", {
      body: { id: cvId },
    });
    return response;
  }

  async function upsert(values: any) {
    const updatedCv = { ...values };

    if (!id) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      updatedCv.created_by = session?.user.id;
    }

    delete updatedCv.projects;
    delete updatedCv.certifications;
    delete updatedCv.educations;
    delete updatedCv.titles;
    delete updatedCv.cv_skill;

    return supabase.from("cv").upsert(updatedCv).select();
  }

  async function upsertCertifications(certifications: any, cvId: string) {
    if (certifications.length === 0) {
      return await supabase.from("certifications").delete().eq("cv_id", cvId);
    }

    if (certificationsToRemove.length !== 0) {
      await supabase
        .from("certifications")
        .delete()
        .in("id", certificationsToRemove);
    }

    const updatedCertifications = certifications.map((certification: any) => ({
      ...certification,
      cv_id: cvId,
      id: certification.id || null,
      created_at: certification.created_at || null,
    }));
    return supabase.from("certifications").upsert(updatedCertifications);
  }

  async function upsertEducation(educations: any, cvId: string) {
    if (educations.length === 0) {
      return await supabase.from("educations").delete().match({ cv_id: cvId });
    }

    if (educationsToRemove.length !== 0) {
      await supabase.from("educations").delete().in("id", educationsToRemove);
    }

    const updatedEducations = educations.map((education: any) => {
      return {
        ...education,
        cv_id: cvId,
        id: education.id || null,
        created_at: education.created_at || null,
      };
    });

    return supabase.from("educations").upsert(updatedEducations);
  }

  async function upsertProjects(projects: any, cvId: string) {
    if (projects.length === 0) {
      return await supabase.from("projects").delete().eq("cv_id", cvId);
    }

    if (projectsToRemove.length !== 0) {
      await supabase.from("projects").delete().in("id", projectsToRemove);
    }

    const updatedProjects = projects.map((project: any) => {
      let startDate = null;
      let endDate = null;
      if (project.date_start && project.date_end) {
        startDate = new Date(project.date_start);
        startDate.setDate(15);
        startDate = startDate.toISOString();
        endDate = new Date(project.date_end);
        endDate.setDate(15);
        endDate = endDate.toISOString();
      }
      return {
        ...project,
        cv_id: cvId,
        date_start: startDate,
        date_end: endDate,
        team_size: project.team_size || null,
        id: project.id || null,
        created_at: project.created_at || null,
        responsibilities: project.responsibilities || null,
        technologies: project.technologies || null,
        ongoing: project.ongoing || false,
      };
    });

    return supabase.from("projects").upsert(updatedProjects);
  }

  async function upsertSkills(skills: Array<FormSkill>, cvId: string) {
    if (skills.length === 0) {
      return await supabase.from("cv_skill").delete().eq("cv_id", cvId);
    }

    const skillsToUpsert: Array<FormSkill> = skills.map((skill) => {
      const initialSkill = initialUserSkills.find(
        (is) => is.skill_id === skill.skill_id,
      );
      if (initialSkill) return initialSkill;
      return { id: null, cv_id: cvId, skill_id: skill.skill_id };
    });

    const skillsToRemove: Array<string> = [];

    // compare initial skills with updated skills to determine if we need to remove some of the skills from database
    initialUserSkills.forEach((initialSkill) => {
      const skillFound = skillsToUpsert.find(
        (skill) => skill.skill_id === initialSkill.skill_id,
      );
      if (!skillFound) {
        skillsToRemove.push(initialSkill.id);
      }
    });

    if (skillsToRemove.length !== 0) {
      await supabase.from("cv_skill").delete().in("id", skillsToRemove);
    }

    return supabase.from("cv_skill").upsert(skillsToUpsert);
  }

  async function handleSubmit(values: any) {
    const title = values.title_id
      ? // when title_id is present, find *will* find and return title object
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        titles.find((title) => title.id === values.title_id)!.name
      : "";

    const { data, error } = await upsert(values);
    setServerErrorMessage(error ? error.message : "");

    if (error) {
      return setServerErrorMessage(error.message);
    }

    if (!data) return;
    const cvId = data[0].id;

    if (values.cv_skill) {
      const { error } = await upsertSkills(values.cv_skill, cvId);
      if (error) {
        setServerErrorMessage(error ? error.message : "");
        return;
      }
    }

    if (values.educations) {
      const { error } = await upsertEducation(values.educations, cvId);
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
      const fileName = `BDIT_${values.first_name}_${title}`;
      const folderName = `${values.first_name} ${values.last_name} (${title})`;
      const uploadsuccessful = await uploadPdf(fileName, folderName);
      if (!uploadsuccessful) {
        setServerErrorMessage(
          "An error occured while uploading to google drive",
        );
        return;
      }
    }

    router.push("/");
  }

  if (loading) return <h1>Loading...</h1>;

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
          <div className="body-font overflow-hidden rounded-md border-2 border-gray-200 text-gray-600 dark:border-gray-700">
            <div className="container mx-auto px-16 py-24">
              <PersonalInfo fProps={formProps} titles={titles} />
              <TechnicalSkill fProps={formProps} skills={skills} />
              <Projects
                fProps={formProps}
                setProjectsToRemove={setProjectsToRemove}
              />
              <Education
                fProps={formProps}
                setEducationsToRemove={setEducationsToRemove}
              />
              <EnglishLevel />
              <AdditionalInfo
                formProps={formProps}
                setCertificationsToRemove={setCertificationsToRemove}
              />

              <button
                className="mt-20 w-full rounded-md bg-indigo-500 p-5 text-white hover:bg-indigo-600"
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

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

type Skill = {
  id: string | null;
  cv_id?: string;
  skill_id: string;
};

type SkillGroup = {
  [key: string]: {
    group_name: string;
    skills: Array<{ id: string; name: string }>;
  };
};

type SkillResponse = {
  id: string;
  cv_id: string;
  skill_id: string;
};

interface Props {
  id?: string;
}

export default function AddNewCvForm({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<any>>({
    first_name: "",
    last_name: "",
    summary: "",
    educations: [],
    english_written_level: "",
    english_spoken_level: "",
    projects: [],
    certifications: [],
    personal_qualities: [],
    availablePositions: [],
    cv_skill: [],
  });
  const [skills, setSkills] = useState<SkillGroup>({});
  const [initialUserSkills, setInitialUserSkills] = useState<
    Array<SkillResponse>
  >([]);
  const [serverErrorMessage, setServerErrorMessage] = useState<string>();
  const [educationsToRemove, setEducationsToRemove] = useState<Array<string>>(
    [],
  );
  const [projectsToRemove, setProjectsToRemove] = useState<Array<string>>([]);
  const [certificationsToRemove, setCertificationsToRemove] = useState<
    Array<string>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches = [fetchSkills()];
    if (id) {
      fetches.push(fetchCv(id));
    } else {
      fetches.push(setAvailablePositions());
    }
    Promise.all(fetches).then(() => setLoading(false));
  }, [id]);

  async function fetchSkills() {
    const { data } = await supabase
      .from("skill")
      .select("id, name, skill_group(name, id)")
      .order("name");

    const mappedSkills: SkillGroup = (data as any)?.reduce(
      (acc: SkillGroup, skill: any) => {
        return {
          [skill?.skill_group.id]: {
            group_name: skill?.skill_group.name,
            group_id: skill?.skill_group.id,
            skills: acc[skill.skill_group.id]
              ? acc[skill.skill_group.id].skills.push({
                  name: skill.name,
                  id: skill.id,
                })
              : [],
          },
          ...acc,
        };
      },
      {},
    );

    setSkills(mappedSkills);
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    english_spoken_level: Yup.string().required("Please select a level"),
    english_written_level: Yup.string().required("Please select a level"),
  });

  async function setAvailablePositions() {
    const availablePositions = await fetchAvailablePositions();
    const formData = {
      ...form,
      availablePositions: availablePositions,
    };
    setForm(formData);
  }

  async function fetchAvailablePositions() {
    const positions = await supabase.from("positions").select("id, title");
    return positions.data;
  }

  async function fetchCv(employeeId: string) {
    const { data } = await supabase
      .from("cv")
      .select(
        "*, projects(*), educations(*), certifications(*), positions(*), cv_skill(*)",
      )
      .eq("id", employeeId);

    if (!data) return;

    setInitialUserSkills(data[0].cv_skill);

    const availablePositions = await fetchAvailablePositions();

    const updatedProjects = data[0].projects.map((project: any) => {
      return {
        ...project,
        date_start: new Date(project.date_start),
        date_end: new Date(project.date_end),
      };
    });

    const formData = {
      ...data[0],
      projects: updatedProjects,
      educations: data[0].educations,
      availablePositions: availablePositions,
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
    delete updatedCv.availablePositions;
    delete updatedCv.positions;
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
      const startDate = new Date(project.date_start);
      startDate.setDate(15);

      let endDate = null;
      if (project.date_end) {
        endDate = new Date(project.date_end);
        endDate.setDate(15);
      }
      return {
        ...project,
        cv_id: cvId,
        date_start: startDate.toISOString(),
        date_end: endDate?.toISOString() || null,
        id: project.id || null,
        created_at: project.created_at || null,
        responsibilities: project.responsibilities || null,
        technologies: project.technologies || null,
        ongoing: project.ongoing || false,
      };
    });

    return supabase.from("projects").upsert(updatedProjects);
  }

  async function upsertSkills(skills: Array<Skill>, cvId: string) {
    if (skills.length === 0) {
      return await supabase.from("cv_skill").delete().eq("cv_id", cvId);
    }

    const skillsToUpsert: Array<Skill> = skills.map((skill) => {
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
    const positionTitle = values.positions.title;
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
      const fileName = `${values.first_name} - ${positionTitle}`;
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
          <div className="body-font overflow-hidden rounded-md border-2 border-gray-200 dark:border-gray-700 text-gray-600">
            <div className="container mx-auto px-16 py-24">
              <PersonalInfo fProps={formProps} />
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

"use client";

import supabase from "../utils/supabase_browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CV } from "./types";
import * as Options from "../constants/CvFormOptions";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CvFieldArray from "./cv_form/cv_field_array";
import Projects from "./cv_form/projects";
import TechnicalSkill from "./cv_form/technical_skill";

const attributes = [
  "id",
  "first_name",
  "last_name",
  "summary",
  "university",
  "degree",
  "university_end",
  "university_start",
  "english_spoken",
  "english_written",
  "certifications",
  "personal_qualities",
  "projects",
  "technical_skills",
];

interface Props {
  id?: string;
}

export default function AddNewCvForm({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<CV>>({
    first_name: "",
    last_name: "",
    summary: "",
    university: "",
    degree: "",
    university_end: "",
    university_start: "",
    english_spoken: "",
    english_written: "",
    projects: [],
    // cvs_projects: [],
    certifications: [],
    personal_qualities: [],
    technical_skills: [],
  });
  const [serverErrorMessage, setServerErrorMessage] = useState<string>();

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    english_spoken: Yup.string().required("Please select a level"),
    english_written: Yup.string().required("Please select a level"),
  });

  async function fetchCv(employeeId: string) {
    const { data } = await supabase
      .from("cv")
      .select("*, technical_skills(*)")
      .eq("id", employeeId);

    const { data: projects } = await supabase
      .from("cvs_projects")
      .select(`*, projects (*)`)
      .eq("cv_id", employeeId);

    if (data && data.length === 1) {
      const formData = attributes.reduce((acc, attr) => {
        acc[attr as keyof CV] = data[0][attr];
        return acc;
      }, {} as Partial<CV>);

      setForm({ ...formData, projects: projects });
    }
  }

  async function upsertCvs(values: any) {
    const updatedCv = { ...values };

    if (!id) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      updatedCv.created_by = session?.user.id;
    }

    delete updatedCv.projects;
    delete updatedCv.technical_skills;

    return supabase.from("cv").upsert(updatedCv).select();
  }

  async function upsertProjects(values: any, cvData: any) {
    const cv_id = cvData[0].id;

    const projectValues = {
      id: values.projects.id,
      name: values.projects.name,
      description: values.projects.description,
      field: values.projects.field,
      team_size: values.projects.team_size,
    };

    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .upsert(projectValues);

    setServerErrorMessage(projectError ? projectError.message : "");

    const cvsProjectsValues = {
      id: values.id,
      position: values.position,
      technologies: values.technologies,
      responsibilities: values.responsibilities,
      from_month: values.from_month,
      from_year: values.from_year,
      until_month: values.until_month,
      until_year: values.until_year,
      cv_id: cv_id,
      project_id: projectValues.id,
    };

    const { data: cvsProjects, error: cvsProjectsError } = await supabase
      .from("cvs_projects")
      .upsert(cvsProjectsValues);

    setServerErrorMessage(cvsProjectsError ? cvsProjectsError.message : "");
  }

  async function upsertSkills(values: any, cvData: any) {
    values.cv_id = cvData[0].id;
    return supabase.from("technical_skills").upsert(values);
  }

  async function handleSubmit(values: any) {
    const { data, error } = await upsertCvs(values);
    setServerErrorMessage(error ? error.message : "");

    values.projects?.forEach((project: any) => upsertProjects(project, data));
    values.technical_skills?.forEach(async (skill: any) => {
      const { data: skillsData, error: skillError } = await upsertSkills(
        skill,
        data,
      );
      setServerErrorMessage(skillError ? skillError.message : "");
    });
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
              <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Name
                    </span>
                  </div>
                  <div className="md:flex-grow flex">
                    <div className="w-1/2 inline-block pr-1">
                      <Field
                        className="rounded-md w-full"
                        name="first_name"
                        type="text"
                        placeholder="First Name"
                      />
                      <ErrorMessage
                        className="text-red-600 w-full"
                        name="first_name"
                        component="span"
                      />
                    </div>
                    <div className="w-1/2 inline-block pl-1">
                      <Field
                        className="rounded-md w-full"
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                      />
                      <ErrorMessage
                        className="text-red-600 w-full"
                        name="last_name"
                        component="span"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Summary of Qualification
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name="summary"
                      type="text"
                      as="textarea"
                    />
                  </div>
                </div>
              </div>

              <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
                Technical skills
              </h2>

              <TechnicalSkill fProps={formProps} />

              <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
                Projects
              </h2>

              <Projects fProps={formProps} />

              <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
                Education
              </h2>

              <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      University
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name="university"
                      type="text"
                      placeholder="Name of University"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Degree
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name="degree"
                      type="text"
                      placeholder="Degree"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Duration
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <label className="dark:text-gray-400">From</label>
                    <Field
                      as="select"
                      name="university_start"
                      className="rounded-md ml-2 mr-6"
                    >
                      <option />
                      {Options.yearsOptions.map((year) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </Field>

                    <label className="dark:text-gray-400">Until</label>
                    <Field
                      as="select"
                      name="university_end"
                      className="rounded-md mx-2"
                    >
                      <option />
                      {Options.yearsOptions.map((year) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>

              <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
                Level of English
              </h2>

              <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Spoken
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as="select"
                      name="english_spoken"
                      className="w-full rounded-md"
                    >
                      <option />
                      {Options.englishLevels.map((level) => (
                        <option value={level.value} key={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      className="text-red-600 w-full"
                      name="english_spoken"
                      component="span"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Written
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as="select"
                      name="english_written"
                      className="w-full rounded-md"
                    >
                      <option />
                      {Options.englishLevels.map((level) => (
                        <option value={level.value} key={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      className="text-red-600 w-full"
                      name="english_written"
                      component="span"
                    />
                  </div>
                </div>
              </div>

              <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
                Additional
              </h2>

              <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
                <CvFieldArray
                  fProps={formProps}
                  title={"Certifications"}
                  fieldArrayName={"certifications"}
                />

                <CvFieldArray
                  fProps={formProps}
                  title={"Personal Qualities"}
                  fieldArrayName={"personal_qualities"}
                />
              </div>

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

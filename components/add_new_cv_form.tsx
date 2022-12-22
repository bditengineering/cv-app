"use client";

import { getSupabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CV } from "./types";
import * as Icons from "./Icons";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  "programming_languages",
  "libs_and_frameworks",
  "big_data",
  "databases",
  "devops",
  "certifications",
  "personal_qualities",
  "projects",
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
    certifications: [],
    personal_qualities: [],
    programming_languages: [],
    libs_and_frameworks: [],
    big_data: [],
    databases: [],
    devops: [],
  });
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

  const englishLevels = [
    { value: "no proficiency", label: "No Proficiency" },
    { value: "elementary proficiency", label: "Elementary Proficiency" },
    {
      value: "limited working proficiency",
      label: "Limited Working Proficiency",
    },
    {
      value: "professional working proficiency",
      label: "Professional Working Proficiency",
    },
    {
      value: "full professional proficiency",
      label: "Full Professional Proficiency",
    },
    {
      value: "native or bilingual proficiency",
      label: "Native Or Bilingual Proficiency",
    },
  ];

  const monthsOptions = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  const year = new Date().getFullYear();
  const yearsOptions = Array.from(new Array(50), (val, index) => year - index);

  //todo: handle other validations and add more styling
  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
  });

  async function fetchCv() {
    const { data } = await getSupabase()
      .from("cv")
      .select("*, projects(*)")
      .eq("id", id);

    if (data && data.length === 1) {
      const formData = attributes.reduce((acc, attr) => {
        acc[attr as keyof CV] = data[0][attr];
        return acc;
      }, {} as Partial<CV>);

      setForm(formData);
    }
  }

  async function upsert(values: any) {
    const CV = { ...values };
    delete CV.projects;

    if (id) {
      return getSupabase().from("cv").update(CV).eq("id", id).select();
    }

    const {
      data: { session },
    } = await getSupabase().auth.getSession();

    return getSupabase()
      .from("cv")
      .insert({
        ...CV,
        created_by: session?.user.id,
      })
      .select();
  }

  async function upsertProjects(values: any, cvData: any) {
    if (values.id) {
      return getSupabase().from("projects").update(values).eq("id", values.id);
    }
    return getSupabase()
      .from("projects")
      .insert({ ...values, cv_id: cvData[0].id });
  }

  async function handleSubmit(values: any) {
    const { data, error } = await upsert(values);
    values.projects.forEach((project: any) => upsertProjects(project, data));

    if (error) {
      setServerErrorMessage(error.message);
    } else {
      await router.push("/");
    }
  }

  useEffect(() => {
    if (id) {
      fetchCv();
    }
  }, []);

  return (
    <Formik
      initialValues={{
        first_name: form.first_name,
        last_name: form.last_name,
        summary: form.summary,
        university: form.university,
        degree: form.degree,
        university_end: form.university_end,
        university_start: form.university_start,
        english_spoken: form.english_spoken,
        english_written: form.english_written,
        projects: form.projects,
        certifications: form.certifications,
        personal_qualities: form.personal_qualities,
        programming_languages: form.programming_languages,
        libs_and_frameworks: form.libs_and_frameworks,
        big_data: form.big_data,
        databases: form.databases,
        devops: form.devops,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
      enableReinitialize
    >
      {(formProps) => (
        <Form>
          <div className="body-font overflow-hidden rounded-md border-2 border-gray-200 text-gray-600">
            <div className="container mx-auto px-16 py-24">
              <div className="-my-8 divide-y-2 divide-gray-100">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Name
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="mr-2 w-auto rounded-md"
                      name="first_name"
                      type="text"
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      className="text-red-600"
                      name="first_name"
                      component="span"
                    />

                    <Field
                      className="w-auto rounded-md"
                      name="last_name"
                      type="text"
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      className="text-red-600"
                      name="last_name"
                      component="span"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
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

              <h2 className="my-10 text-2xl font-bold">Technical skills</h2>

              <div className="-my-8 divide-y-2 divide-gray-100">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Programming languages
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="programming_languages"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.programming_languages &&
                            formProps.values.programming_languages.length > 0 &&
                            formProps.values.programming_languages.map(
                              (language: any, languageIndex: any) => (
                                <div
                                  key={languageIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`programming_languages.${languageIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(languageIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                            className="flex text-indigo-500"
                          >
                            <Icons.PlusCircle />
                            <span>Add Skill</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Libs & Frameworks
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="libs_and_frameworks"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.libs_and_frameworks &&
                            formProps.values.libs_and_frameworks.length > 0 &&
                            formProps.values.libs_and_frameworks.map(
                              (framework: any, frameworkIndex: any) => (
                                <div
                                  key={frameworkIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`libs_and_frameworks.${frameworkIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(frameworkIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            className="flex text-indigo-500"
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            <Icons.PlusCircle />
                            <span>Add Skill</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Big Data
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="big_data"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.big_data &&
                            formProps.values.big_data.length > 0 &&
                            formProps.values.big_data.map(
                              (bigData: any, bigDataIndex: any) => (
                                <div
                                  key={bigDataIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`big_data.${bigDataIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(bigDataIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                            className="flex text-indigo-500"
                          >
                            <Icons.PlusCircle />
                            <span>Add Skill</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Databases
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="databases"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.databases &&
                            formProps.values.databases.length > 0 &&
                            formProps.values.databases.map(
                              (database: any, databaseIndex: any) => (
                                <div
                                  key={databaseIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`databases.${databaseIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(databaseIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            className="flex text-indigo-500"
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            <Icons.PlusCircle />
                            <span>Add Skill</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Dev Ops
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="devops"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.devops &&
                            formProps.values.devops.length > 0 &&
                            formProps.values.devops.map(
                              (item: any, devopsIndex: any) => (
                                <div
                                  key={devopsIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`devops.${devopsIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(devopsIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            className="flex text-indigo-500"
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            <Icons.PlusCircle />
                            <span>Add Skill</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <h2 className="my-10 text-2xl font-bold">Projects</h2>

              <FieldArray
                name="projects"
                render={(arrayHelpers) => (
                  <div>
                    {formProps.values.projects &&
                      formProps.values.projects.length > 0 &&
                      formProps.values.projects.map(
                        (project: any, projectsIndex: any) => (
                          <div
                            key={projectsIndex}
                            className="-my-8 mb-10 mt-2 divide-y-2 divide-gray-100 rounded-md border border-gray-400 px-6"
                          >
                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Project Name
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  className="w-full rounded-md"
                                  name={`projects[${projectsIndex}].name`}
                                  type="text"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Project Description
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  className="w-full rounded-md"
                                  name={`projects[${projectsIndex}].description`}
                                  type="text"
                                  as="textarea"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Field
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  className="w-full rounded-md"
                                  name={`projects[${projectsIndex}].field`}
                                  type="text"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Size of the team
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  className="w-full rounded-md"
                                  name={`projects[${projectsIndex}].team_size`}
                                  type="text"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Position
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  className="w-full rounded-md"
                                  name={`projects[${projectsIndex}].position`}
                                  type="text"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Tools & Technologies
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <FieldArray
                                  name={`projects[${projectsIndex}].technologies`}
                                  render={(arrayHelpers) => (
                                    <div>
                                      {formProps.values.projects[projectsIndex]
                                        .technologies &&
                                        formProps.values.projects[projectsIndex]
                                          .technologies.length > 0 &&
                                        formProps.values.projects[
                                          projectsIndex
                                        ].technologies.map(
                                          (
                                            technology: any,
                                            technologiesIndex: any
                                          ) => (
                                            <div
                                              key={technologiesIndex}
                                              className="mb-2 flex w-full"
                                            >
                                              <Field
                                                className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                                name={`projects[${projectsIndex}].technologies.${technologiesIndex}`}
                                              />
                                              <button
                                                className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                                type="button"
                                                onClick={() =>
                                                  arrayHelpers.remove(
                                                    technologiesIndex
                                                  )
                                                }
                                              >
                                                <Icons.TrashCan />
                                              </button>
                                            </div>
                                          )
                                        )}
                                      <button
                                        className="flex text-indigo-500"
                                        type="button"
                                        onClick={() => arrayHelpers.push("")}
                                      >
                                        <Icons.PlusCircle />
                                        <span>Add</span>
                                      </button>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Responsibilities
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <FieldArray
                                  name={`projects[${projectsIndex}].responsibilities`}
                                  render={(arrayHelpers) => (
                                    <div>
                                      {formProps.values.projects[projectsIndex]
                                        .responsibilities &&
                                        formProps.values.projects[projectsIndex]
                                          .responsibilities.length > 0 &&
                                        formProps.values.projects[
                                          projectsIndex
                                        ].responsibilities.map(
                                          (
                                            responsibility: any,
                                            responsibilitiesIndex: any
                                          ) => (
                                            <div
                                              key={responsibilitiesIndex}
                                              className="mb-2 flex w-full"
                                            >
                                              <Field
                                                className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                                name={`projects[${projectsIndex}].responsibilities.${responsibilitiesIndex}`}
                                              />
                                              <button
                                                className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                                type="button"
                                                onClick={() =>
                                                  arrayHelpers.remove(
                                                    responsibilitiesIndex
                                                  )
                                                }
                                              >
                                                <Icons.TrashCan />
                                              </button>
                                            </div>
                                          )
                                        )}
                                      <button
                                        className="flex text-indigo-500"
                                        type="button"
                                        onClick={() => arrayHelpers.push("")}
                                      >
                                        <Icons.PlusCircle />
                                        <span>Add</span>
                                      </button>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  From
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  as="select"
                                  name={`projects[${projectsIndex}].from_month`}
                                >
                                  {monthsOptions.map((month) => (
                                    <option
                                      value={month.value}
                                      key={month.value}
                                    >
                                      {month.label}
                                    </option>
                                  ))}
                                </Field>
                                <Field
                                  as="select"
                                  name={`projects[${projectsIndex}].from_year`}
                                >
                                  {yearsOptions.map((year) => (
                                    <option value={year} key={year}>
                                      {year}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700">
                                  Until
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  as="select"
                                  name={`projects[${projectsIndex}].until_month`}
                                >
                                  {monthsOptions.map((month) => (
                                    <option
                                      value={month.value}
                                      key={month.value}
                                    >
                                      {month.label}
                                    </option>
                                  ))}
                                </Field>
                                <Field
                                  as="select"
                                  name={`projects[${projectsIndex}].until_year`}
                                >
                                  {yearsOptions.map((year) => (
                                    <option value={year} key={year}>
                                      {year}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <button
                                className="flex text-indigo-500"
                                type="button"
                                onClick={() =>
                                  arrayHelpers.remove(projectsIndex)
                                }
                              >
                                <Icons.TrashCan />
                                Remove Project
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    <button
                      className="flex flex-wrap text-indigo-500"
                      type="button"
                      onClick={() => arrayHelpers.push({})}
                    >
                      <Icons.PlusCircle />
                      <span>Add Project</span>
                    </button>
                  </div>
                )}
              />

              <h2 className="my-10 text-2xl font-bold">Education</h2>

              <div className="-my-8 divide-y-2 divide-gray-100">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
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
                    <span className="title-font font-semibold text-gray-700">
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
                    <span className="title-font font-semibold text-gray-700">
                      Duration
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <label>From</label>
                    <Field as="select" name="university_start">
                      {yearsOptions.map((year) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </Field>

                    <label>Until</label>
                    <Field as="select" name="university_end">
                      {yearsOptions.map((year) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>

              <h2 className="my-10 text-2xl font-bold">Level of English</h2>

              <div className="-my-8 divide-y-2 divide-gray-100">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Spoken
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as="select"
                      name="english_spoken"
                      className="w-full rounded-md"
                    >
                      {englishLevels.map((level) => (
                        <option value={level.value} key={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Written
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as="select"
                      name="english_written"
                      className="w-full rounded-md"
                    >
                      {englishLevels.map((level) => (
                        <option value={level.value} key={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>

              <h2 className="my-10 text-2xl font-bold">Additional</h2>

              <div className="-my-8 divide-y-2 divide-gray-100">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Certifications
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="certifications"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.certifications &&
                            formProps.values.certifications.length > 0 &&
                            formProps.values.certifications.map(
                              (certification: any, certificationIndex: any) => (
                                <div
                                  key={certificationIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`certifications.${certificationIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(certificationIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            className="flex text-indigo-500"
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            <Icons.PlusCircle />
                            <span>Add</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700">
                      Personal Qualities
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name="personal_qualities"
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values.personal_qualities &&
                            formProps.values.personal_qualities.length > 0 &&
                            formProps.values.personal_qualities.map(
                              (quality: any, personalIndex: any) => (
                                <div
                                  key={personalIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    name={`personal_qualities.${personalIndex}`}
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1"
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(personalIndex)
                                    }
                                  >
                                    <Icons.TrashCan />
                                  </button>
                                </div>
                              )
                            )}
                          <button
                            className="flex text-indigo-500"
                            type="button"
                            onClick={() => arrayHelpers.push("")}
                          >
                            <Icons.PlusCircle />
                            <span>Add</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <button
                className="my-10 rounded-md bg-purple-700 p-5 text-white hover:bg-purple-800"
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

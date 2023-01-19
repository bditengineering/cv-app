"use client";

import supabase from "../utils/supabase_browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CV } from "./types";
import * as Icons from "./Icons";
import * as Options from "../constants/CvFormOptions";
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

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    english_spoken: Yup.string().required("Please select a level"),
    english_written: Yup.string().required("Please select a level"),
    projects: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Project name is required"),
      }),
    ),
  });

  async function fetchCv(employeeId: string) {
    const { data } = await supabase
      .from("cv")
      .select("*, projects(*)")
      .eq("id", employeeId);

    if (data && data.length === 1) {
      const formData = attributes.reduce((acc, attr) => {
        acc[attr as keyof CV] = data[0][attr];
        return acc;
      }, {} as Partial<CV>);

      setForm(formData);
    }
  }

  async function upsert(values: any) {
    const updatedCv = { ...values };

    if (!id) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      updatedCv.created_by = session?.user.id
    }

    delete updatedCv.projects;

    return supabase
      .from("cv")
      .upsert(updatedCv)
      .select();
  }

  async function upsertProjects(values: any, cvData: any) {
    if (values.id) {
      return supabase.from("projects").update(values).eq("id", values.id);
    }
    return supabase.from("projects").insert({ ...values, cv_id: cvData[0].id });
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
      fetchCv(id);
    }
  }, [id]);

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

              <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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

              <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
                Projects
              </h2>

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
                            className="-my-8 mb-10 mt-2 divide-y-2 divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-400 dark:border-gray-700 px-6"
                          >
                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                                  Project Name
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  className="w-full rounded-md"
                                  name={`projects[${projectsIndex}].name`}
                                  type="text"
                                />
                                <ErrorMessage
                                  className="text-red-600 w-full"
                                  name={`projects[${projectsIndex}].name`}
                                  component="span"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                            technologiesIndex: any,
                                          ) => (
                                            <div
                                              key={technologiesIndex}
                                              className="mb-2 flex w-full"
                                            >
                                              <Field
                                                className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                                                name={`projects[${projectsIndex}].technologies.${technologiesIndex}`}
                                              />
                                              <button
                                                className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                                type="button"
                                                onClick={() =>
                                                  arrayHelpers.remove(
                                                    technologiesIndex,
                                                  )
                                                }
                                              >
                                                <Icons.TrashCan />
                                              </button>
                                            </div>
                                          ),
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
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                            responsibilitiesIndex: any,
                                          ) => (
                                            <div
                                              key={responsibilitiesIndex}
                                              className="mb-2 flex w-full"
                                            >
                                              <Field
                                                className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                                                name={`projects[${projectsIndex}].responsibilities.${responsibilitiesIndex}`}
                                              />
                                              <button
                                                className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                                type="button"
                                                onClick={() =>
                                                  arrayHelpers.remove(
                                                    responsibilitiesIndex,
                                                  )
                                                }
                                              >
                                                <Icons.TrashCan />
                                              </button>
                                            </div>
                                          ),
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
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                                  From
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  as="select"
                                  name={`projects[${projectsIndex}].from_month`}
                                  className="rounded-md w-1/2 mr-2"
                                >
                                  <option />
                                  {Options.monthsOptions.map((month) => (
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
                                  className="rounded-md w-1/3"
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

                            <div className="flex flex-wrap py-8 md:flex-nowrap">
                              <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                                <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                                  Until
                                </span>
                              </div>
                              <div className="md:flex-grow">
                                <Field
                                  as="select"
                                  name={`projects[${projectsIndex}].until_month`}
                                  className="rounded-md w-1/2 mr-2"
                                >
                                  <option />
                                  {Options.monthsOptions.map((month) => (
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
                                  className="rounded-md w-1/3"
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
                        ),
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
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
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
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
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
                              ),
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

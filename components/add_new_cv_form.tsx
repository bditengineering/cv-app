"use client";

import { getSupabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CV } from "./types";
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

  //todo: handle other validations and add styling
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
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="summary">Summary of Qualification</label>
            <Field
              className="rounded-md"
              name="summary"
              type="text"
              as="textarea"
            />

            <label htmlFor="first_name">First Name</label>
            <Field className="rounded-md" name="first_name" type="text" />
            <ErrorMessage
              className="text-red-600"
              name="first_name"
              component="span"
            />

            <label htmlFor="last_name">Last Name</label>
            <Field className="rounded-md" name="last_name" type="text" />
            <ErrorMessage
              className="text-red-600"
              name="last_name"
              component="span"
            />

            <h2>Technical skills</h2>

            <label>Programming languages</label>
            <FieldArray
              name="programming_languages"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.programming_languages &&
                  formProps.values.programming_languages.length > 0 ? (
                    formProps.values.programming_languages.map(
                      (language: any, languageIndex: any) => (
                        <div key={languageIndex}>
                          <Field
                            name={`programming_languages.${languageIndex}`}
                          />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(languageIndex)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(languageIndex, "")
                            }
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add language
                    </button>
                  )}
                </div>
              )}
            />

            <label>Libs & Frameworks</label>
            <FieldArray
              name="libs_and_frameworks"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.libs_and_frameworks &&
                  formProps.values.libs_and_frameworks.length > 0 ? (
                    formProps.values.libs_and_frameworks.map(
                      (framework: any, frameworkIndex: any) => (
                        <div key={frameworkIndex}>
                          <Field
                            name={`libs_and_frameworks.${frameworkIndex}`}
                          />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(frameworkIndex)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(frameworkIndex, "")
                            }
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add lib/framework
                    </button>
                  )}
                </div>
              )}
            />

            <label>Big Data</label>
            <FieldArray
              name="big_data"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.big_data &&
                  formProps.values.big_data.length > 0 ? (
                    formProps.values.big_data.map(
                      (bigData: any, bigDataIndex: any) => (
                        <div key={bigDataIndex}>
                          <Field name={`big_data.${bigDataIndex}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(bigDataIndex)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(bigDataIndex, "")
                            }
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add skill
                    </button>
                  )}
                </div>
              )}
            />

            <label>Databases</label>
            <FieldArray
              name="databases"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.databases &&
                  formProps.values.databases.length > 0 ? (
                    formProps.values.databases.map(
                      (database: any, databaseIndex: any) => (
                        <div key={databaseIndex}>
                          <Field name={`databases.${databaseIndex}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(databaseIndex)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(databaseIndex, "")
                            }
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add skill
                    </button>
                  )}
                </div>
              )}
            />

            <label>Dev Ops</label>
            <FieldArray
              name="devops"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.devops &&
                  formProps.values.devops.length > 0 ? (
                    formProps.values.devops.map(
                      (item: any, devopsIndex: any) => (
                        <div key={devopsIndex}>
                          <Field name={`devops.${devopsIndex}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(devopsIndex)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(devopsIndex, "")}
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add skill
                    </button>
                  )}
                </div>
              )}
            />

            <h2>Projects</h2>

            <FieldArray
              name="projects"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.projects &&
                    formProps.values.projects.length > 0 &&
                    formProps.values.projects.map(
                      (project: any, projectsIndex: any) => (
                        <div key={projectsIndex}>
                          <label>Project name</label>
                          <Field
                            className="rounded-md"
                            name={`projects[${projectsIndex}].name`}
                            type="text"
                          />

                          <label>Project description</label>
                          <Field
                            className="rounded-md"
                            name={`projects[${projectsIndex}].description`}
                            type="text"
                            as="textarea"
                          />

                          <label>Field</label>
                          <Field
                            className="rounded-md"
                            name={`projects[${projectsIndex}].field`}
                            type="text"
                          />

                          <label>Size of the team</label>
                          <Field
                            className="rounded-md"
                            name={`projects[${projectsIndex}].team_size`}
                            type="text"
                          />

                          <label>Position</label>
                          <Field
                            className="rounded-md"
                            name={`projects[${projectsIndex}].position`}
                            type="text"
                          />

                          <label>Tools & Technologies</label>
                          <FieldArray
                            name={`projects[${projectsIndex}].technologies`}
                            render={(arrayHelpers) => (
                              <div>
                                {formProps.values.projects[projectsIndex]
                                  .technologies &&
                                formProps.values.projects[projectsIndex]
                                  .technologies.length > 0 ? (
                                  formProps.values.projects[
                                    projectsIndex
                                  ].technologies.map(
                                    (
                                      technology: any,
                                      technologiesIndex: any
                                    ) => (
                                      <div key={technologiesIndex}>
                                        <Field
                                          name={`projects[${projectsIndex}].technologies.${technologiesIndex}`}
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.remove(
                                              technologiesIndex
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.insert(
                                              technologiesIndex,
                                              ""
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.push("")}
                                  >
                                    Add a technology
                                  </button>
                                )}
                              </div>
                            )}
                          />

                          <label htmlFor="responsibilities">
                            Responsibilities
                          </label>
                          <FieldArray
                            name={`projects[${projectsIndex}].responsibilities`}
                            render={(arrayHelpers) => (
                              <div>
                                {formProps.values.projects[projectsIndex]
                                  .responsibilities &&
                                formProps.values.projects[projectsIndex]
                                  .responsibilities.length > 0 ? (
                                  formProps.values.projects[
                                    projectsIndex
                                  ].responsibilities.map(
                                    (
                                      responsibility: any,
                                      responsibilitiesIndex: any
                                    ) => (
                                      <div key={responsibilitiesIndex}>
                                        <Field
                                          name={`projects[${projectsIndex}].responsibilities.${responsibilitiesIndex}`}
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.remove(
                                              responsibilitiesIndex
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.insert(
                                              responsibilitiesIndex,
                                              ""
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.push("")}
                                  >
                                    Add a responsibility
                                  </button>
                                )}
                              </div>
                            )}
                          />
                          <label>From:</label>
                          <Field
                            as="select"
                            name={`projects[${projectsIndex}].from_month`}
                          >
                            {monthsOptions.map((month) => (
                              <option value={month.value} key={month.value}>
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

                          <label>Until:</label>
                          <Field
                            as="select"
                            name={`projects[${projectsIndex}].until_month`}
                          >
                            {monthsOptions.map((month) => (
                              <option value={month.value} key={month.value}>
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

                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(projectsIndex)}
                          >
                            remove project
                          </button>
                        </div>
                      )
                    )}
                  <button type="button" onClick={() => arrayHelpers.push({})}>
                    add project
                  </button>
                </div>
              )}
            />

            <h2>Education</h2>
            <label htmlFor="university">University</label>
            <Field className="rounded-md" name="university" type="text" />

            <label htmlFor="degree">Degree</label>
            <Field className="rounded-md" name="degree" type="text" />

            <label htmlFor="university_start">From</label>
            <Field as="select" name="university_start">
              {yearsOptions.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </Field>

            <label htmlFor="university_end">Until</label>
            <Field as="select" name="university_end">
              {yearsOptions.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </Field>

            <h2>Level of English</h2>
            <label htmlFor="english_spoken">Spoken</label>
            <Field as="select" name="english_spoken">
              {englishLevels.map((level) => (
                <option value={level.value} key={level.value}>
                  {level.label}
                </option>
              ))}
            </Field>
            <label htmlFor="english_written">Written</label>
            <Field as="select" name="english_written">
              {englishLevels.map((level) => (
                <option value={level.value} key={level.value}>
                  {level.label}
                </option>
              ))}
            </Field>

            <h2>Certifications</h2>
            <FieldArray
              name="certifications"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.certifications &&
                  formProps.values.certifications.length > 0 ? (
                    formProps.values.certifications.map(
                      (certification: any, certificationIndex: any) => (
                        <div key={certificationIndex}>
                          <Field
                            name={`certifications.${certificationIndex}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.remove(certificationIndex)
                            }
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(certificationIndex, "")
                            }
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add a certification
                    </button>
                  )}
                </div>
              )}
            />

            <h2>Personal Qualities</h2>
            <FieldArray
              name="personal_qualities"
              render={(arrayHelpers) => (
                <div>
                  {formProps.values.personal_qualities &&
                  formProps.values.personal_qualities.length > 0 ? (
                    formProps.values.personal_qualities.map(
                      (quality: any, personalIndex: any) => (
                        <div key={personalIndex}>
                          <Field name={`personal_qualities.${personalIndex}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(personalIndex)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(personalIndex, "")
                            }
                          >
                            +
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <button type="button" onClick={() => arrayHelpers.push("")}>
                      Add a quality
                    </button>
                  )}
                </div>
              )}
            />

            <button
              className="rounded-md bg-purple-700 p-5 text-white hover:bg-purple-800"
              type="submit"
            >
              Submit
            </button>
            {serverErrorMessage && <p>Error: {serverErrorMessage}</p>}
          </div>
        </Form>
      )}
    </Formik>
  );
}

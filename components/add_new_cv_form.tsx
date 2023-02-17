"use client";

import supabase from "../utils/supabase_browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CV } from "./types";
import * as Options from "../constants/CvFormOptions";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import CvFieldArray from "./cv_form/cv_field_array";
import Projects from "./cv_form/projects";
import TechnicalSkill from "./cv_form/technical_skill";
import * as Icons from "./Icons";

const attributes = [
  "id",
  "first_name",
  "last_name",
  "summary",
  "english_spoken_level",
  "english_written_level",
  "certifications",
  "personal_qualities",
  "education",
  "projects",
];

interface Props {
  id?: string;
}

export default function AddNewCvForm({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<any>>({
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
      education: data[0].education[0],
    };

    setForm(formData);
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
    delete updatedCv.education;

    return supabase.from("cv").upsert(updatedCv).select();
  }

  async function upsertCertifications(certifications: any, cvId: string) {
    if (certifications.length === 0) {
      return await supabase.from("certifications").delete().eq("cv_id", cvId);
    }

    const updatedCertifications = certifications.map((certification: any) => ({
      ...certification,
      cv_id: cvId,
    }));
    return supabase.from("certifications").upsert(updatedCertifications);
  }

  async function upsertEducation(education: any, cvId: string) {
    education.cv_id = cvId;
    return supabase.from("education").upsert(education);
  }

  async function upsertProjects(projects: any, cvId: string) {
    if (projects.length === 0) {
      return await supabase.from("projects").delete().eq("cv_id", cvId);
    }

    const updatedProjects = projects.map((project: any) => {
      return {
        ...project,
        cv_id: cvId,
      };
    });

    return supabase.from("projects").upsert(updatedProjects);
  }

  async function handleSubmit(values: any) {
    const { data, error } = await upsert(values);
    setServerErrorMessage(error ? error.message : "");

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
                      name="education.university_name"
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
                      name="education.degree"
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
                      name="education.start_year"
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
                      name="education.end_year"
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
                      name="english_spoken_level"
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
                      name="english_spoken_level"
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
                      name="english_written_level"
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
                      name="english_written_level"
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
                      name={"certifications"}
                      render={(arrayHelpers) => (
                        <div>
                          {formProps.values?.["certifications"]?.length > 0 &&
                            formProps.values["certifications"].map(
                              (item: any, index: any) => (
                                <div key={index} className="py-2">
                                  <div className="mb-2 flex w-full">
                                    <Field
                                      name={`certifications.${index}.certificate_name`}
                                      className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                                      placeholder="name"
                                    />
                                  </div>
                                  <div className="mb-2 flex w-full">
                                    <Field
                                      name={`certifications.${index}.description`}
                                      className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                                      placeholder="description"
                                    />
                                  </div>
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1 text-white float-right"
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
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
                            <span>Add</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

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

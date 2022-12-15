"use client";

import { getSupabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CV } from "./types";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const attributes = ["first_name", "last_name"];

interface Props {
  id?: string;
}

export default function AddNewCvForm({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<CV>>({
    first_name: "",
    last_name: "",
  });
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

  //todo: move arrays below to other file and import here
  const programmingLanguages = [
    { value: "java", label: "Java" },
    { value: "javaScript", label: "JavaScript" },
    { value: "scala", label: "Scala" },
    { value: "typeScript", label: "TypeScript" },
    { value: "php", label: "PHP" },
  ];

  const libsAndFrameworks = [
    { value: "react", label: "React" },
    { value: "angularJs", label: "AngularJS" },
    { value: "angular2", label: "Angular 2+" },
    { value: "nodeJs", label: "Node.js" },
    { value: "expressJs", label: "Express.js" },
    { value: "vue", label: "Vue" },
    { value: "vanillaJs", label: "Vanilla JS" },
    { value: "spring", label: "Spring" },
    { value: "bootstrap", label: "Bootstrap" },
  ];

  const bigData = [
    { value: "kafka", label: "Kafka" },
    { value: "spark", label: "Spark" },
    { value: "hadoop", label: "Hadoop" },
    { value: "sqoop", label: "Sqoop" },
    { value: "flume", label: "Flume" },
    { value: "oozie", label: "Oozie" },
  ];

  const databases = [
    { value: "mongoDB", label: "MongoDB" },
    { value: "mssQL", label: "MSSQL" },
    { value: "mysql", label: "MySQL" },
    { value: "oracle", label: "Oracle" },
    { value: "pl/sql", label: "PL/SQL" },
  ];

  const devops = [
    { value: "kubernetes", label: "Kubernetes" },
    { value: "docker", label: "Docker" },
  ];

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
  });

  async function fetchCv() {
    const { data } = await getSupabase().from("cv").select("*").eq("id", id);

    if (data && data.length === 1) {
      const formData = attributes.reduce((acc, attr) => {
        acc[attr as keyof CV] = data[0][attr];
        return acc;
      }, {} as Partial<CV>);

      setForm(formData);
    }
  }

  async function upsert(values: any) {
    if (id) {
      return getSupabase().from("cv").update(values).eq("id", id);
    }

    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    return getSupabase()
      .from("cv")
      .insert({
        ...values,
        created_by: session?.user.id,
      });
  }

  async function handleSubmit(values: any) {
    const { data, error } = await upsert(values);
    if (error) {
      setServerErrorMessage(error.message);
    } else {
      await router.push("/");
    }
  }

  useEffect(() => {
    fetchCv();
  }, []);

  return (
    <Formik
      initialValues={{ first_name: form.first_name, last_name: form.last_name }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
      enableReinitialize
    >
      <Form>
        <div className="grid grid-cols-1 gap-3">
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

          <div id="checkbox-group-programming-language">
            Programming languages
          </div>
          <div
            className="grid grid-cols-3 "
            role="group"
            aria-labelledby="checkbox-group-programming-language"
          >
            {programmingLanguages.map((item: any) => (
              <label className="mr-16" key={item.value}>
                <Field
                  className="mr-2 rounded"
                  type="checkbox"
                  name="programmingLanguage"
                  value={item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div id="checkbox-group-libs-and-frameworks">Libs & Frameworks</div>
          <div
            className="grid grid-cols-3"
            role="group"
            aria-labelledby="checkbox-group-libs-and-frameworks"
          >
            {libsAndFrameworks.map((item: any) => (
              <label className="mr-16" key={item.value}>
                <Field
                  className="mr-2 rounded"
                  type="checkbox"
                  name="libsAndFrameworks"
                  value={item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div id="checkbox-group-big-data">Big Data</div>
          <div
            className="grid grid-cols-3"
            role="group"
            aria-labelledby="checkbox-group-big-data"
          >
            {bigData.map((item: any) => (
              <label className="mr-16" key={item.value}>
                <Field
                  className="mr-2 rounded"
                  type="checkbox"
                  name="bigData"
                  value={item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div id="checkbox-group-databases">Databases</div>
          <div
            className="grid grid-cols-3"
            role="group"
            aria-labelledby="checkbox-group-databases"
          >
            {databases.map((item: any) => (
              <label className="mr-16" key={item.value}>
                <Field
                  className="mr-2 rounded"
                  type="checkbox"
                  name="database"
                  value={item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div id="checkbox-group-devops">Dev Ops</div>
          <div
            className="grid grid-cols-3"
            role="group"
            aria-labelledby="checkbox-group-devops"
          >
            {devops.map((item: any) => (
              <label className="mr-16" key={item.value}>
                <Field
                  className="mr-2 rounded"
                  type="checkbox"
                  name="devops"
                  value={item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
          {/* todo: add other fields */}
          <button
            className="rounded-md bg-purple-700 p-5 text-white hover:bg-purple-800"
            type="submit"
          >
            Submit
          </button>
          {serverErrorMessage && <p>Error: {serverErrorMessage}</p>}
        </div>
      </Form>
    </Formik>
  );
}

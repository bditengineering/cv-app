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
        <label htmlFor="first_name">First Name</label>
        <Field name="first_name" type="text" />
        <ErrorMessage name="first_name" />

        <label htmlFor="last_name">Last Name</label>
        <Field name="last_name" type="text" />
        <ErrorMessage name="last_name" />

        <button type="submit">Submit</button>
        {serverErrorMessage && <p>Error: {serverErrorMessage}</p>}
      </Form>
    </Formik>
  );
}

"use client";

import { getSupabase } from "../utils/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SignInForm() {
  const router = useRouter();
  const [hasServerError, setHasServerError] = useState<boolean>(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  async function signIn(values: { email: string; password: string }) {

    const email = values.email;
    const password = values.password;

    const { data, error } = await getSupabase().auth.signInWithPassword({
      email, //: 'example@email.com',
      password, //: 'example-password',
    });
    if (error) {
      setHasServerError(true);
      setServerErrorMessage(error.message);
    } else {
      clearErrorState();
      await router.push("/");
    }
  }

  const clearErrorState = () => {
    setHasServerError(false);
    setServerErrorMessage("");
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        signIn(values);
      }}
    >
      <Form>
        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />

        <label htmlFor="email">Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" />

        <button type="submit">Submit</button>
        {hasServerError && <p>Error: {serverErrorMessage}</p>}
      </Form>
    </Formik>
  );
}

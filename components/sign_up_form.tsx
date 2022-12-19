"use client";

import supabase from "../utils/supabase_browser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SignUpForm() {
  const router = useRouter();
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters"),
    repeatPassword: Yup.string()
      .required("Repeat password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  async function signUp(values: { email: string; password: string }) {
    const email = values.email;
    const password = values.password;

    const { data, error } = await supabase.auth.signUp({
      email, //: 'example@email.com',
      password, //: 'example-password',
    });
    if (error) {
      setServerErrorMessage(error.message);
    } else {
      clearErrorState();
      await router.push("/");
    }
  }

  const clearErrorState = () => {
    setServerErrorMessage("");
  };

  return (
    <Formik
      initialValues={{ email: "", password: "", repeatPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        signUp(values);
      }}
    >
      <Form>
        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />

        <label htmlFor="password">Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" />

        <label htmlFor="repeatPassword">Repeat password</label>
        <Field name="repeatPassword" type="password" />
        <ErrorMessage name="repeatPassword" />

        <button type="submit">Submit</button>
        {serverErrorMessage && <p>Error: {serverErrorMessage}</p>}
      </Form>
    </Formik>
  );
}

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
        <div className="mb-1 flex flex-row justify-start space-x-2">
          <div className="h-9 w-3 bg-purple-700"></div>
          <div className="text-center text-3xl font-bold">
            <h1>Sign Up</h1>
          </div>
        </div>
        <div className="flex flex-col">
          <Field
            name="email"
            type="email"
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
            placeholder="Email"
          />
          <ErrorMessage
            name="email"
            className="text-sm text-purple-400"
            component="span"
          />

          <Field
            name="password"
            type="password"
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
            placeholder="Password"
          />
          <ErrorMessage
            name="password"
            className="text-sm text-purple-400"
            component="span"
          />

          <Field
            name="repeatPassword"
            type="password"
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
            placeholder="Repeat password"
          />
          <ErrorMessage
            name="repeatPassword"
            className="text-sm text-purple-400"
            component="span"
          />
        </div>

        <div className="my-2 flex justify-center">
          <button
            className="w-72 rounded-md border bg-purple-700 p-2 font-bold text-white"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        {serverErrorMessage && (
          <span className="my-2 flex justify-center text-purple-400">
            *{serverErrorMessage}
          </span>
        )}
      </Form>
    </Formik>
  );
}

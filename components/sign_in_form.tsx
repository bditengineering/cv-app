"use client";

import supabase from "../utils/supabase_browser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SignInForm() {
  const router = useRouter();
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().required("Password is required"),
  });

  async function signIn(values: { email: string; password: string }) {
    const email = values.email;
    const password = values.password;

    const { data, error } = await supabase.auth.signInWithPassword({
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
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        signIn(values);
      }}
    >
      <Form>
        <div className="mb-1 flex flex-row justify-start space-x-2">
          <div className="h-9 w-3 bg-purple-700"></div>
          <div className="text-center text-3xl font-bold">
            <h1>Login</h1>
          </div>
        </div>
        <div className="flex flex-col">
          <Field
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
            name="email"
            type="email"
            placeholder="Email"
          />
          <ErrorMessage
            className="text-sm text-purple-400"
            name="email"
            component="span"
          />
          <Field
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
            name="password"
            type="password"
            placeholder="Password"
          />
          <ErrorMessage
            className="text-sm text-purple-400"
            name="password"
            component="span"
          />
        </div>

        <div className="my-2 flex justify-center">
          <button
            className="w-72 rounded-md border bg-purple-700 p-2 font-bold text-white"
            type="submit"
          >
            Log In
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

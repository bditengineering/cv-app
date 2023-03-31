"use client";

import supabase from "../utils/supabase_browser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@ui/button";

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
        <div className="mt-8 flex flex-row justify-start space-x-2">
          <div className="h-9 w-3 bg-indigo-700"></div>
          <div className="text-center text-3xl font-bold">
            <h1>Sign in</h1>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="gap-1.5">
            <Field
              className="w-full rounded-md border-gray-400 p-2 dark:text-black"
              name="email"
              type="email"
              placeholder="Email"
            />
            <ErrorMessage
              className="text-sm text-red-500"
              name="email"
              component="span"
            />
          </div>

          <div className="gap-1.5">
            <Field
              className="w-full rounded-md border-gray-400 p-2 dark:text-black"
              name="password"
              type="password"
              placeholder="Password"
            />
            <ErrorMessage
              className="text-sm text-red-500"
              name="password"
              component="span"
            />
          </div>
        </div>

        <div className="mt-6 w-full gap-1.5">
          <Button className="my-2" fullWidth type="submit">
            Submit
          </Button>

          {serverErrorMessage && (
            <span className="my-2 flex justify-start text-red-500">
              *{serverErrorMessage}
            </span>
          )}
        </div>
      </Form>
    </Formik>
  );
}

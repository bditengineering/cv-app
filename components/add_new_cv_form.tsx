"use client";

import { jsPDF } from "jspdf";
import supabase from "../utils/supabase_browser";
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
    const { data } = await supabase.from("cv").select("*").eq("id", id);

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
      return supabase.from("cv").update(values).eq("id", id);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    return supabase.from("cv").insert({
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

  const nameDiv = `
  <div style="padding: 15; border: 1px solid black;">
    <span style="color: orange; magin: 20px">Name: ${form.first_name}</span>
    <span style="color: green;">Last name: ${form.last_name}</span>
  </div>`;

  const html = `
  <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </head>
    <body>
      <div style="padding: 15; border: 1px solid black;">
        <span style="color: red; display: inline;">Name: ${form.first_name}</span>
        <span style="color: blue;">Last name: ${form.last_name}</span>
      </div>
    </body>
  </html>`;

  const htmlNoScript = `
  <html>
    <body>
      <div style="padding: 15; border: 1px solid black;">
        <span style="color: red; display: inline;">Name: ${form.first_name}</span>
        <span style="color: blue;">Last name: ${form.last_name}</span>
      </div>
    </body> 
  </html>`;

  const html2 = `
  <html>
    <head>
      <style>
        .personName { color: blue; }
        .personLastName { color: red; }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </head>
    <body>
      <div>
        <span class="personName">Name: ${form.first_name}</span>
        <span class="personLastName">Last name: ${form.last_name}</span>
      </div>
    </body> 
  </html>`;

  const htmlNoScript2 = `
  <html>
    <head>
      <style>
        .personName { color: blue; }
        .personLastName { color: red; }
      </style>
    </head>
    <body>
      <div>
        <span class="personName">Name: ${form.first_name}</span>
        <span class="personLastName">Last name: ${form.last_name}</span>
      </div>
    </body> 
  </html>`;

  function generateSimplePDF() {
    const doc = new jsPDF();
    doc.html(html, {
      async callback(doc) {
        doc.output("dataurlnewwindow");
        // doc.save("generatedCV.pdf");
      },
    });
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
        <div className="flex flex-col">
          <label htmlFor="first_name">First Name</label>
          <Field
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
            name="first_name"
            type="text"
          />
          <ErrorMessage
            name="first_name"
            className="text-sm text-purple-400"
            component="span"
          />

          <label htmlFor="last_name">Last Name</label>
          <Field
            name="last_name"
            type="text"
            className="my-2 w-72 rounded-md border-gray-400 p-2 dark:text-black"
          />
          <ErrorMessage
            name="last_name"
            className="text-sm text-purple-400"
            component="span"
          />
        </div>

        <div className="my-2 flex justify-center">
          <button
            type="submit"
            className="w-72 rounded-md border bg-purple-700 p-2 font-bold text-white"
          >
            Submit
          </button>
        </div>
        <button
          className="mt-20 rounded-md bg-indigo-500 p-5 text-white hover:bg-indigo-600 w-full"
          onClick={generateSimplePDF}
        >
          generate PDF
        </button>
        {serverErrorMessage && (
          <span className="my-2 flex justify-center text-purple-400">
            *{serverErrorMessage}
          </span>
        )}
      </Form>
    </Formik>
  );
}

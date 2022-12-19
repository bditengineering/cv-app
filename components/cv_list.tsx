"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../utils/supabase";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import { CV } from "./types";

export default function CVList() {
  const [cvs, setCvs] = useState<null | Array<CV>>(null);
  const [session, setSession] = useState<null | Session>(null);

  async function getCvs() {
    const { data: cvs } = await getSupabase().from("cv").select("*");
    setCvs(cvs);
  }

  async function getSession() {
    const {
      data: { session: supabaseSession },
      error,
    } = await getSupabase().auth.getSession();
    if (!supabaseSession || error) return null;

    setSession(supabaseSession);
  }

  useEffect(() => {
    getCvs();
    getSession();
  }, []);

  function renderAddNew() {
    if (!session) return null;

    return (
      <Link
        className="mt-5 rounded-md border bg-purple-700 px-4 py-2 text-white"
        prefetch={false}
        href={"/new"}
      >
        Add new CV
      </Link>
    );
  }

  return (
    <>
      <table className="border-3 min-w-full table-auto border-collapse">
        <thead className="justify-between">
          <tr className="bg-gray-800">
            <th className="px-16 py-2 text-gray-300">ID</th>
            <th className="px-16 py-2 text-gray-300">First Name</th>
            <th className="px-16 py-2 text-gray-300">Last Name</th>
            <th className="px-16 py-2 text-gray-300">Created At</th>
            <th className="px-16 py-2 text-gray-300"></th>
          </tr>
        </thead>
        <tbody className="bg-gray-200">
          {cvs?.map((cv) => (
            <tr key={cv.id}>
              <td className="px-16 py-2 dark:text-black">{cv.id}</td>
              <td className="px-16 py-2 dark:text-black">{cv.first_name}</td>
              <td className="px-16 py-2 dark:text-black">{cv.last_name}</td>
              <td className="px-16 py-2 dark:text-black">{cv.created_at}</td>
              <td className="px-16 py-2 dark:text-black">
                <Link
                  className="rounded-md border bg-purple-700 px-4 py-2 text-white"
                  prefetch={false}
                  href={`/edit/${cv.id}`}
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderAddNew()}
    </>
  );
}

"use client";

import supabase from "../utils/supabase_browser";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import { CV, admin } from "./types";

interface CVListProps {
  cvs: CV[] | null;
  session: Session | null;
  admin: admin[] | null;
}

export default function CVList({ cvs, session, admin }: CVListProps) {
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

  async function deleteCV(cv_id: any) {
    const { data, error } = await supabase.from("cv").delete().eq("id", cv_id);
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
              {admin && admin?.length > 0 && (
                <td className="px-16 py-2 dark:text-black">
                  <button
                    className="rounded-md border bg-purple-700 px-4 py-2 text-white"
                    onClick={() => deleteCV(cv.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {renderAddNew()}
    </>
  );
}

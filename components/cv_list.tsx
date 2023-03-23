"use client";

import Link from "next/link";
import { CV } from "./types";
import { supabase } from "../utils/supabase";

interface CVListProps {
  cvs: CV[] | null;
}

export default function CVList({ cvs }: CVListProps) {
  async function downloadPdf(fileName: string) {
    const { data, error } = await supabase.storage
      .from("pdfs")
      .download(fileName);

    if (error) throw error;
    if (!data) throw new Error("No data received from Supabase.");

    const objectUrl = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    link.click();
  }

  return (
    <>
      <table className="border-3 min-w-full table-auto border-collapse my-4">
        <thead className="justify-between">
          <tr className="bg-gray-800">
            <th className="px-16 py-2 text-gray-300">First Name</th>
            <th className="px-16 py-2 text-gray-300">Last Name</th>
            <th className="px-16 py-2 text-gray-300">Specialty</th>
            <th className="px-16 py-2 text-gray-300">Updated At</th>
            <th className="px-16 py-2 text-gray-300">Updated By</th>
            <th className="px-16 py-2 text-gray-300">Download</th>
            <th className="px-16 py-2 text-gray-300"></th>
          </tr>
        </thead>
        <tbody className="bg-gray-200">
          {cvs?.map((cv) => (
            <tr key={cv.id}>
              <td className="px-16 py-2 dark:text-black">{cv.first_name}</td>
              <td className="px-16 py-2 dark:text-black">{cv.last_name}</td>
              <td className="px-16 py-2 dark:text-black">
                {cv.positions.title}
              </td>
              <td className="px-16 py-2 dark:text-black">
                {new Date(cv.updated_at).toLocaleDateString("de-DE")}
              </td>
              <td className="px-16 py-2 dark:text-black">{cv.user.email}</td>
              <td className="px-16 py-2 dark:text-black">
                <button
                  onClick={() =>
                    downloadPdf(`${cv.first_name} - ${cv.positions.title}`)
                  }
                >
                  Download
                </button>
              </td>
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

      <Link
        className="rounded-md border bg-purple-700 px-4 py-2 text-white block w-fit m-auto"
        prefetch={false}
        href={"/new"}
      >
        Add new CV
      </Link>
    </>
  );
}

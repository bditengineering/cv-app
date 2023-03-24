"use client";

import Link from "next/link";
import { cva } from "class-variance-authority";
import { supabase } from "../utils/supabase";
import { Plus } from "@ui/icons";
import { buttonClasses } from "@ui/button";
import type { CV } from "./types";

interface CVListProps {
  cvs: CV[] | null;
}

const tableHeaderCellClasses = cva(
  "px-6 py-3 border-0 text-gray-600 font-medium text-sm leading-normal text-left",
);
const tableCellClasses = cva(
  "px-6 py-4 border-0 text-gray-600 text-base leading-normal",
);

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
      <div className="w-full my-4 border bg-white border-gray-200 rounded-xl overflow-hidden shadow">
        <table className="w-full border-0">
          <thead>
            <tr className="bg-gray-50 border-b border-b-gray-200">
              <th className={tableHeaderCellClasses()}>Name</th>
              <th className={tableHeaderCellClasses()}>Role</th>
              <th className={tableHeaderCellClasses()}>Last update</th>
              <th
                className={tableHeaderCellClasses({ className: "w-px" })}
              ></th>
            </tr>
          </thead>

          <tbody>
            {cvs?.map((cv) => (
              <tr
                key={cv.id}
                className="border-b border-b-gray-200 [&:last-child]:border-b-0"
              >
                <td className={tableCellClasses()}>
                  <div className="text-gray-900 font-medium">
                    {cv.first_name} {cv.last_name}
                  </div>
                </td>
                <td className={tableCellClasses()}>{cv.positions.title}</td>
                <td className={tableCellClasses()}>
                  <div>
                    {new Date(cv.updated_at).toLocaleDateString("de-DE")}
                  </div>

                  <div className="truncate">{cv.user.email}</div>
                </td>
                <td className={tableCellClasses({ className: "w-px" })}>
                  <div className="flex gap-3">
                    <button
                      className="font-semibold text-gray-600 text-base leading-normal"
                      type="button"
                      onClick={() =>
                        downloadPdf(`${cv.first_name} - ${cv.positions.title}`)
                      }
                    >
                      Download
                    </button>

                    <Link
                      className="font-semibold text-indigo-700 text-base leading-normal"
                      prefetch={false}
                      href={`/edit/${cv.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-fit mx-auto">
        <Link className={buttonClasses()} prefetch={false} href="/new">
          <Plus className="w-5 h-5" /> Add new CV
        </Link>
      </div>
    </>
  );
}

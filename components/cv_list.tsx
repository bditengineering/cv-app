"use client";

import Link from "next/link";
import { supabase } from "../utils/supabase";
import { Plus } from "@ui/icons";
import { buttonClasses } from "@ui/button";
import { TableContainer, Table, TableCell, TableRow } from "@ui/table";
import type { CV } from "./types";

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
      <TableContainer>
        <Table>
          <thead>
            <TableRow header>
              <TableCell header align="left">
                Name
              </TableCell>
              <TableCell header align="left">
                Role
              </TableCell>
              <TableCell header align="left">
                Last update
              </TableCell>
              <TableCell header align="left" className="w-px"></TableCell>
            </TableRow>
          </thead>

          <tbody>
            {cvs?.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>
                  <div className="text-gray-900 font-medium">
                    {cv.first_name} {cv.last_name}
                  </div>
                </TableCell>
                <TableCell>{cv.positions.title}</TableCell>
                <TableCell>
                  <div>
                    {new Date(cv.updated_at).toLocaleDateString("de-DE")}
                  </div>

                  <div className="truncate">{cv.user.email}</div>
                </TableCell>
                <TableCell className="w-px">
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
                      className="font-semibold text-indigo-700 text-base leading-normal hover:text-indigo-800"
                      prefetch={false}
                      href={`/edit/${cv.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <div className="w-fit mx-auto">
        <Link className={buttonClasses()} prefetch={false} href="/new">
          <Plus className="w-5 h-5" /> Add new CV
        </Link>
      </div>
    </>
  );
}

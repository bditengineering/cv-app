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
                  <div className="font-medium text-gray-900">
                    {cv.first_name} {cv.last_name}
                  </div>
                </TableCell>
                <TableCell>{cv.titles.name}</TableCell>
                <TableCell>
                  <div>
                    {new Date(cv.updated_at).toLocaleDateString("de-DE")}
                  </div>

                  <div className="truncate">{cv.user.email}</div>
                </TableCell>
                <TableCell className="w-px">
                  <div className="flex gap-3">
                    <button
                      className="text-base font-semibold leading-normal text-gray-600"
                      type="button"
                      onClick={() =>
                        downloadPdf(`${cv.first_name} - ${cv.titles.name}`)
                      }
                    >
                      Download
                    </button>

                    <Link
                      className="text-base font-semibold leading-normal text-indigo-700 hover:text-indigo-800"
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

      <div className="mx-auto w-fit">
        <Link className={buttonClasses()} prefetch={false} href="/new">
          <Plus className="h-5 w-5" /> Add new CV
        </Link>
      </div>
    </>
  );
}

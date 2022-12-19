"use client";

import { useEffect, useState } from "react";
import supabase from "../utils/supabase_browser";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import { CV } from "./types";

interface CVListProps {
  cvs: CV[] | null;
}

export default function CVList({ cvs }: CVListProps) {
  const [session, setSession] = useState<null | Session>(null);

  async function getSession() {
    const {
      data: { session: supabaseSession },
      error,
    } = await supabase.auth.getSession();
    if (!supabaseSession || error) return null;

    setSession(supabaseSession);
  }

  useEffect(() => {
    getSession();
  }, []);

  function renderAddNew() {
    if (!session) return null;

    return (
      <Link prefetch={false} href={"/new"}>
        Add new CV
      </Link>
    );
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cvs?.map((cv) => (
            <tr key={cv.id}>
              <td>{cv.id}</td>
              <td>{cv.first_name}</td>
              <td>{cv.last_name}</td>
              <td>{cv.created_at}</td>
              <td>
                <Link prefetch={false} href={`/edit/${cv.id}`}>
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

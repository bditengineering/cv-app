'use client';

import {useEffect, useState} from "react";
import {getSupabase} from "../utils/supabase";
import Link from "next/link";
import {Session} from "@supabase/supabase-js";
import {CV} from "./types";

export default function CVList() {
  const [cvs, setCvs] = useState<null | Array<CV>>(null);
  const [session, setSession] = useState<null | Session>(null);

  async function getCvs() {
    const {data: cvs} = await getSupabase().from('cv').select('*')
    setCvs(cvs);
  }

  async function getSession() {
    const {data: {session: supabaseSession}, error} = await getSupabase().auth.getSession();
    if (!supabaseSession || error) return null;

    setSession(supabaseSession);
  }

  useEffect(() => {
    getCvs();
    getSession();
  }, []);

  function renderAddNew() {
    if (!session) return null;

    return <Link prefetch={false} href={'/new'}>Add new CV</Link>;
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
            <td><Link prefetch={false} href={`/edit/${cv.id}`}>Edit</Link></td>
          </tr>
        ))}
        </tbody>
      </table>
      {renderAddNew()}
    </>
  )
}
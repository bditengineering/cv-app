'use client';

import {getSupabase} from "../utils/supabase";
import {useRouter} from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  async function signOut() {
    const { error } = await getSupabase().auth.signOut();
    await router.push('/');
  }

  return (
    <a href="#" onClick={signOut}>Sign Out</a>
  )
}
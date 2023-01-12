"use client";

import supabase from "../utils/supabase_browser";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    await router.push("/");
  }

  return (
    <a href="#" onClick={signOut} className="signOut">
      Sign Out
    </a>
  );
}

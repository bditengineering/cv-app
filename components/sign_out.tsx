"use client";

import Button from "@ui/Button";
import { useRouter } from "next/navigation";
import supabase from "../utils/supabase_browser";

export default function SignOut() {
  const router = useRouter();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    await router.push("/");
  }

  return (
    <Button variant="plain" className="mx-auto" onClick={signOut}>
      Sign Out
    </Button>
  );
}

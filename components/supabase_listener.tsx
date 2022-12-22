"use client";

// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import supabase from "../utils/supabase_browser";

export default function SupabaseListener({
  accessToken,
}: {
  accessToken?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });
  }, [accessToken]);

  return null;
}

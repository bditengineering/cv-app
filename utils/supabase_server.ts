import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

const createServerClient = () =>
  createServerComponentSupabaseClient({
    headers,
    cookies,
  });

export default createServerClient;

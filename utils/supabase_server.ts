// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../supabase/schema";

const createServerClient = () =>
  // data returned from the response does not match up with auto-generated types
  // createServerComponentSupabaseClient<Database>({
  createServerComponentSupabaseClient({
    headers,
    cookies,
  });

export default createServerClient;

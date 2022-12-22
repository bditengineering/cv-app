// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient({ req, res });

  //  Since we don't have access to set cookies or headers from Server Components, we need to create a Middleware Supabase client and refresh the user's session by calling getSession()
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return res;
}

// Middleware runs before every route declared in the matcher array.
export const config = {
  matcher: ["/*"],
};

// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import "./globals.css";

import createClient from "../utils/supabase_server";
import SupabaseListener from "../components/supabase_listener";
import SignIn from "../components/sign_in_form";
import Link from "next/link";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <SupabaseListener accessToken={session?.access_token} />
        {session?.access_token ? (
          children
        ) : (
          <div className="flex justify-center">
            <div className="pt-10">
              <div>
                <SignIn />
              </div>
              <div>
                <Link href={"/signup"}>Sign Up</Link>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}

// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

import createClient from "../utils/supabase_server";
import SupabaseListener from "../components/supabase_listener";

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
        {children}
      </body>
    </html>
  );
}

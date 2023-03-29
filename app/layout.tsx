// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import createServerClient from "../utils/supabase_server";
import SupabaseListener from "../components/supabase_listener";
import SupabaseProvider from "../components/supabase_provider";

import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className="h-full">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-full">
        <SupabaseProvider session={session}>
          <SupabaseListener accessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}

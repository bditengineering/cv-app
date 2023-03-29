"use client";

// based on https://github.com/supabase/auth-helpers/blob/2a85f3db6815b8baf7ff44d48c4fc54e2bfba210/examples/nextjs-server-components/components/supabase-provider.tsx
import { createContext, useContext } from "react";
import supabase from "../utils/supabase_browser";
import type { Session } from "@supabase/auth-helpers-nextjs";

type MaybeSession = Session | null;

type SupabaseContext = {
  supabase: /* TypedSupabaseClient */ any;
  session: MaybeSession;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const Context = createContext<SupabaseContext>();

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: MaybeSession;
}) {
  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => useContext(Context);

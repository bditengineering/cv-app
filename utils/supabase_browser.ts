// based on https://github.com/supabase/auth-helpers/tree/main/examples/nextjs-server-components

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../supabase/schema";

// data returned from the response does not match up with auto-generated types
// export default createBrowserSupabaseClient<Database>();
export default createBrowserSupabaseClient();

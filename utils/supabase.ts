import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_SECRET_SERVICE_ROLE ?? "";

export const supabase = createClient(url, key)

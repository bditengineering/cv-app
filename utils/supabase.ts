import { createClient } from '@supabase/supabase-js'

const NEXT_PUBLIC_SUPABASE_URL= "https://lcfztnwcvbwktlagmxdm.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjZnp0bndjdmJ3a3RsYWdteGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjkwNDA2OTMsImV4cCI6MTk4NDYxNjY5M30.v-1-eyYA2EG1N6vmMkdyLAk93s8UjS30kbxrniLRg3w"

const getSupabase = () => {
  const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  return supabase
}

export { getSupabase }
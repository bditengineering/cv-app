import { supabase } from "../utils/supabase";
import type { SkillResponse } from "../components/types";

export async function fetchSkills() {
  const { data } = await supabase
    .from("skill")
    .select("id, name, skill_group(id, name)")
    .order("name")
    .returns<SkillResponse>();

  return data;
}

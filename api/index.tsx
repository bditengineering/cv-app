import { supabase } from "../utils/supabase";

export async function fetchSkills() {
  const { data } = await supabase
    .from("skill")
    .select("id, name, skill_group(id, name, order)")
    .order("name")
    .returns();

  return data;
}

export async function fetchTitles() {
  const { data } = await supabase.from("titles").select("id, name").returns();

  return data;
}

export async function fetchCv(employeeId: string) {
  const { data } = await supabase
    .from("cv")
    .select(
      "*, projects(*), educations(*), certifications(*), titles(*), cv_skill(*)",
    )
    .eq("id", employeeId)
    .single();

  return data;
}

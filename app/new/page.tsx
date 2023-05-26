import { fetchTitles, fetchSkills } from "../../api";
import AddNewCvForm from "../../components/add_new_cv_form";
import CVLayout from "../../components/layouts/cv";
import type { SkillResponse, TitlesResponse } from "../../components/types";
import { transformSkills } from "../../helpers";

export default async function NewCv() {
  const skills = await fetchSkills();
  const titles = (await fetchTitles()) || [];

  return (
    <CVLayout title="Add new CV">
      <AddNewCvForm
        skills={transformSkills(skills as SkillResponse[])}
        titles={titles as TitlesResponse[]}
      />
    </CVLayout>
  );
}

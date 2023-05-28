import { fetchTitles, fetchSkills, fetchCv } from "../../../api";
import AddNewCvForm from "../../../components/add_new_cv_form";
import CVLayout from "../../../components/layouts/cv";
import type { SkillResponse, TitlesResponse } from "../../../components/types";
import { transformSkills } from "../../../helpers";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditCv({ params: { id } }: Props) {
  let skills = [] as any;
  let titles = [] as any;
  let cv = {} as any;
  let initialUserSkills = [] as any;

  try {
    skills = await fetchSkills();
    titles = (await fetchTitles()) || [];
    cv = await fetchCv(id);
    initialUserSkills = cv?.cv_skill || [];
  } catch (error) {
    console.log(error);
  }

  return (
    <CVLayout title="Edit CV">
      <AddNewCvForm
        id={id}
        cv={cv}
        initialUserSkills={initialUserSkills}
        skills={transformSkills(skills as SkillResponse[])}
        titles={titles as TitlesResponse[]}
      />
    </CVLayout>
  );
}

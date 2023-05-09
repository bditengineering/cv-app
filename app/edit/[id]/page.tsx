import { fetchTitles, fetchSkills, fetchCv } from "../../../api";
import AddNewCvForm from "../../../components/add_new_cv_form";
import CVLayout from "../../../components/layouts/cv";
import { transformSkills } from "../../../helpers";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditCv({ params: { id } }: Props) {
  const skills = await fetchSkills();
  const titles = (await fetchTitles()) || [];
  const cv = await fetchCv(id);
  const initialUserSkills = cv?.cv_skill || [];

  return (
    <CVLayout title="Edit CV">
      <AddNewCvForm
        id={id}
        cv={cv}
        initialUserSkills={initialUserSkills}
        skills={transformSkills(skills)}
        titles={titles}
      />
    </CVLayout>
  );
}

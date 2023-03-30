import { fetchTitles, fetchSkills } from "../../../api";
import AddNewCvForm from "../../../components/add_new_cv_form";
import CVLayout from "../../../components/layouts/cv";
import { transformSkills } from "../../../helpers";

interface Props {
  params: {
    id: string;
  };
}

export const dynamic = "force-static";

export default async function EditCv({ params: { id } }: Props) {
  const skills = await fetchSkills();
  const titles = (await fetchTitles()) || [];

  return (
    <CVLayout title="Edit CV">
      <AddNewCvForm id={id} skills={transformSkills(skills)} titles={titles} />
    </CVLayout>
  );
}

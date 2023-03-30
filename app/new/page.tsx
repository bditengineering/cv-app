import { fetchSkills } from "../../api";
import AddNewCvForm from "../../components/add_new_cv_form";
import CVLayout from "../../components/layouts/cv";
import { transformSkills } from "../../helpers";

export default async function NewCv() {
  const skills = await fetchSkills();

  return (
    <CVLayout title="Add new CV">
      <AddNewCvForm skills={transformSkills(skills)} />
    </CVLayout>
  );
}

import { fetchSkills } from "../../../api";
import AddNewCvForm from "../../../components/add_new_cv_form";
import { transformSkills } from "../../../helpers";
import styles from "../../Home.module.css";

interface Props {
  params: {
    id: string;
  };
}

export const dynamic = "force-static";

export default async function EditCv({ params: { id } }: Props) {
  const skillsResponse = await fetchSkills();
  const skills = transformSkills(skillsResponse);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className="mb-6 text-center text-5xl font-bold">Edit CV</h1>
        <AddNewCvForm id={id} skills={skills} />
      </main>
    </div>
  );
}

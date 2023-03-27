import { fetchSkills } from "../../api";
import AddNewCvForm from "../../components/add_new_cv_form";
import { transformSkills } from "../../helpers";
import styles from "../Home.module.css";

export default async function NewCv() {
  const skillsResponse = await fetchSkills();
  const skills = transformSkills(skillsResponse);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className="mb-6 text-center text-5xl font-bold">Add New CV</h1>
        <AddNewCvForm skills={skills} />
      </main>
    </div>
  );
}

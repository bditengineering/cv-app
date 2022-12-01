import AddNewCvForm from "../../components/add_new_cv_form";
import styles from "../Home.module.css";

export default function NewCv() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Add New CV
        </h1>
        <AddNewCvForm />
      </main>
    </div>
  )
}
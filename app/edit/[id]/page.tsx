import AddNewCvForm from "../../../components/add_new_cv_form";
import styles from "../../Home.module.css";

interface Props {
  params: {
    id: string
  }
}

export default function EditCv({ params: { id }}: Props) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Edit CV {}
        </h1>
        <AddNewCvForm id={id}/>
      </main>
    </div>
  )
}
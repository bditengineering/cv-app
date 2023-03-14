import AddNewCvForm from "../../../components/add_new_cv_form";
import ErrorBoundary from "../../../components/error_boundary";
import styles from "../../Home.module.css";

interface Props {
  params: {
    id: string;
  };
}

export default function EditCv({ params: { id } }: Props) {
  console.log(id);
  return (
    // <div className={styles.container}>
    //   <main className={styles.main}>
    //     <h1 className="mb-6 text-center text-5xl font-bold">Edit CV</h1>
    //     <ErrorBoundary>
    //       <AddNewCvForm id={id} />
    //     </ErrorBoundary>
    //   </main>
    // </div>
    <p>Edit</p>
  );
}

import styles from "../Home.module.css";
import SignUpForm from "../../components/sign_up_form";

export default function SignUp() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SignUpForm />
      </main>
    </div>
  );
}

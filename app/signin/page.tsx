import styles from "../Home.module.css";
import SignInForm from "../../components/sign_in_form";

export default function SignIn() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SignInForm />
      </main>
    </div>
  )
}
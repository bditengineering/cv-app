import styles from "./Home.module.css";
import CVList from "../components/cv_list";
import SignOut from "../components/sign_out";
import Link from "next/link";
import createClient from "../utils/supabase_server";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.from("cv").select("*");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>CV App</h1>
        <div>
          <Link href={"/signin"}>Sign In</Link> |{" "}
          <Link href={"/signup"}>Sign Up</Link> | <SignOut />
        </div>
        <CVList cvs={data} />
      </main>
    </div>
  );
}

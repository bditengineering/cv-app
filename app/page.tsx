import styles from "./Home.module.css";
import CVList from "../components/cv_list";
import SignOut from "../components/sign_out";
import SignIn from "../components/sign_in_form";
import Link from "next/link";
import createClient from "../utils/supabase_server";
import ErrorBoundary from "../components/error_boundary";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase
    .from("cv")
    .select("*, positions(*), user: users!updated_by(*)");
  const {
    data: { session: supabaseSession },
  } = await supabase.auth.getSession();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>CV App</h1>
        <div>
          <ErrorBoundary>
            {supabaseSession ? (
              <>
                <SignOut />
                <CVList cvs={data} session={supabaseSession} />
              </>
            ) : (
              <>
                <SignIn />
                <Link href={"/signup"}>Sign Up</Link>
              </>
            )}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

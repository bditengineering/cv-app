import CVList from "../components/cv_list";
import SignOut from "../components/sign_out";
import SignIn from "../components/sign_in_form";
import Link from "next/link";
import createServerClient from "../utils/supabase_server";
import Container from "@ui/container";

export default async function Home() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cv")
    .select("*, titles(*), user: users!updated_by(*)");
  const {
    data: { session: supabaseSession },
  } = await supabase.auth.getSession();

  return (
    <Container>
      {supabaseSession ? (
        <>
          <SignOut />
          <CVList cvs={data} />
        </>
      ) : (
        <div className="flex min-h-full flex-col items-center justify-center py-12">
          <SignIn />
          <Link href={"/signup"}>Sign Up</Link>
        </div>
      )}
    </Container>
  );
}

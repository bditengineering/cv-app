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

  if (supabaseSession) {
    return (
      <Container>
        <SignOut />
        <CVList cvs={data} />
      </Container>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xs">
        <SignIn />
        <Link className="block text-center" href="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

import Container from "@ui/container";
import NavBar from "../navbar";
import { useSupabase } from "../supabase_provider";

interface Props {
  children: React.ReactNode;
  title: string;
}

const CVLayout = ({ children, title }: Props) => {
  const { session } = useSupabase();

  return (
    <>
      <NavBar title={title} user={session?.user} />

      <main className="py-6">
        <Container>{children}</Container>
      </main>
    </>
  );
};

export default CVLayout;

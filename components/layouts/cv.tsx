import Container from "@ui/container";
import NavBar from "../navbar";

interface Props {
  children: React.ReactNode;
  title: string;
}

const CVLayout = ({ children, title }: Props) => {
  return (
    <>
      <NavBar title={title} />

      <main className="py-6">
        <Container>{children}</Container>
      </main>
    </>
  );
};

export default CVLayout;

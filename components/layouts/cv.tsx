import Container from "@ui/container";
import Logo from "../logo";

interface Props {
  children: React.ReactNode;
  title: string;
}

const CVLayout = ({ children, title }: Props) => {
  return (
    <>
      <header className="bg-white text-gray-800 dark:bg-black dark:text-gray-50 shadow">
        <Container>
          <Logo /> / {title}
        </Container>
      </header>

      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
};

export default CVLayout;

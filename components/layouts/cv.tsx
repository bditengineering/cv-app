import Link from "next/link";

interface Props {
  children: React.ReactNode;
  title: string;
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-screen-xl py-6 px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

const CVLayout = ({ children, title }: Props) => {
  return (
    <>
      <header className="bg-white text-gray-900 dark:bg-black dark:text-gray-50 shadow">
        <Container>
          <Link href="/" className="font-serif text-3xl hover:underline">
            cv
          </Link>
          <h1 className="text-3xl font-bold tracking-tight inline-block ml-4">
            {title}
          </h1>
        </Container>
      </header>

      <main>
        <Container>{children}</Container>
      </main>
    </>
  );
};

export default CVLayout;

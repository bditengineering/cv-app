interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="mx-auto max-w-screen-xl py-6 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default Container;

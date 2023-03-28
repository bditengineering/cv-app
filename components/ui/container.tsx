import { cx } from "class-variance-authority";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cx("mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
};

export default Container;

import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-serif text-2xl text-gray-900 hover:underline"
    >
      cv
    </Link>
  );
};

export default Logo;

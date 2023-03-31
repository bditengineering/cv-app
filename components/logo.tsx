import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="px-2 font-serif text-2xl leading-none text-gray-900 hover:underline"
    >
      cv
    </Link>
  );
};

export default Logo;

import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-serif text-2xl px-2 text-gray-900 leading-none hover:underline"
    >
      cv
    </Link>
  );
};

export default Logo;

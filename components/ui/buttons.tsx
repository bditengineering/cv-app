import React from "react";
import { cva } from "class-variance-authority";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  prefix?: React.ReactNode;
  size?: "small" | "medium" | "large";
  suffix?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "filled" | "tinted" | "outlined" | "plain";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/* TODO
- disabled
*/
export const buttonClasses = cva(
  "button shadow rounded-lg flex items-center gap-x-2 font-semibold focus:outline-none",
  {
    variants: {
      variant: {
        filled:
          "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-4 focus:ring-indigo-100",
        tinted:
          "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 focus:ring-4 focus:ring-indigo-100",
        outlined:
          "border border-gray-300 bg-gray-50 text-gray-700 hover:text-gray-800 focus:ring-4 focus:ring-gray-100",
        plain:
          "text-gray-600 hover:text-gray-700 hover:bg-gray-50 focus:bg-gray-50 shadow-none",
      },
      size: {
        small: "py-2 px-3.5 text-sm",
        medium: "py-2.5 px-4 text-sm",
        large: "py-3 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "medium",
    },
  },
);

const Button = ({
  children,
  className,
  prefix,
  size,
  suffix,
  type = "button",
  variant,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={buttonClasses({ className, variant, size })}
      onClick={onClick}
    >
      {prefix}
      {children}
      {suffix}
    </button>
  );
};

export default Button;

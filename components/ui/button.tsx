import React from "react";
import { cva } from "class-variance-authority";

interface ButtonProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "prefix"
  > {
  prefix?: React.ReactNode;
  size?: "small" | "medium" | "large";
  suffix?: React.ReactNode;
  variant?: "filled" | "tinted" | "outlined" | "plain";
}

export const buttonClasses = cva(
  "button rounded-lg flex items-center gap-x-2 font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        filled:
          "shadow-sm bg-indigo-600 text-white focus:ring-4 focus:ring-indigo-100",
        tinted:
          "bg-indigo-50 text-indigo-700 hover:text-indigo-800 focus:ring-4 focus:ring-indigo-100",
        outlined:
          "shadow-sm border border-gray-300 bg-white text-gray-700 hover:text-gray-800 focus:ring-4 focus:ring-gray-100",
        plain: "text-gray-600 hover:text-gray-700 focus:bg-gray-50",
      },
      size: {
        small: "py-2 px-3.5 text-sm",
        medium: "py-2.5 px-4 text-sm",
        large: "py-3 px-5 text-base",
      },
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    compoundVariants: [
      {
        disabled: false,
        variant: "filled",
        className: "hover:bg-indigo-700",
      },
      {
        disabled: true,
        variant: "filled",
        className: "hover:bg-indigo-600",
      },
      {
        disabled: false,
        variant: "tinted",
        className: "hover:bg-indigo-100",
      },
      {
        disabled: true,
        variant: "tinted",
        className: "hover:bg-indigo-50 hover:text-indigo-700",
      },
      {
        disabled: false,
        variant: "outlined",
        className: "hover:bg-gray-50",
      },
      {
        disabled: true,
        variant: "outlined",
        className: "hover:bg-white hover:text-gray-700",
      },
      {
        disabled: false,
        variant: "plain",
        className: "hover:bg-gray-50",
      },
      {
        disabled: true,
        variant: "plain",
        className: "hover:text-gray-600",
      },
    ],
    defaultVariants: {
      disabled: false,
      variant: "filled",
      size: "medium",
    },
  },
);

const Button = ({
  children,
  className,
  disabled,
  onClick,
  prefix,
  size,
  suffix,
  type = "button",
  variant,
}: ButtonProps) => {
  return (
    <button
      className={buttonClasses({ className, disabled, size, variant })}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {prefix}
      {children}
      {suffix}
    </button>
  );
};

export default Button;

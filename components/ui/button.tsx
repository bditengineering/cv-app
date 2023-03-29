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
  fullWidth?: boolean;
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
        filled: [
          "shadow-sm bg-indigo-600 text-white focus:ring-4 focus:ring-indigo-100",
          "hover:bg-indigo-700",
          "disabled:hover:bg-indigo-600",
        ],
        tinted: [
          "bg-indigo-50 text-indigo-700 focus:ring-4 focus:ring-indigo-100",
          "hover:bg-indigo-100 hover:text-indigo-800",
          // when button is disabled, we dont't want to change background and font color
          // hence we're reverting it to the same values that non-hovered button have
          "disabled:hover:bg-indigo-50 disabled:hover:text-indigo-700",
        ],
        outlined: [
          "shadow-sm border border-gray-300 bg-white text-gray-700 focus:ring-4 focus:ring-gray-100",
          "hover:bg-gray-50 hover:text-gray-800",
          "disabled:hover:bg-white disabled:hover:text-gray-700",
        ],
        plain: [
          "text-gray-600 focus:bg-gray-50",
          "hover:bg-gray-50 hover:text-gray-700",
          "disabled:hover:bg-transparent disabled:hover:text-gray-600",
        ],
      },
      size: {
        small: "py-2 px-3.5 text-sm",
        medium: "py-2.5 px-4 text-sm",
        large: "py-3 px-5 text-base",
      },
      disabled: {
        true: "opacity-50",
      },
      fullWidth: {
        true: "w-full justify-center",
      },
    },
    defaultVariants: {
      disabled: false,
      fullWidth: false,
      size: "medium",
      variant: "filled",
    },
  },
);

const Button = React.forwardRef(
  (
    {
      children,
      className,
      disabled,
      fullWidth,
      onClick,
      prefix,
      size,
      suffix,
      type = "button",
      variant,
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    return (
      <button
        className={buttonClasses({
          className,
          disabled,
          fullWidth,
          size,
          variant,
        })}
        disabled={disabled}
        onClick={onClick}
        type={type}
        ref={ref}
      >
        {prefix}
        {children}
        {suffix}
      </button>
    );
  },
);
Button.displayName = "Button";

export default Button;

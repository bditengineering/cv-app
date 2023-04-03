import React, { useRef } from "react";
import { cva, cx } from "class-variance-authority";

interface InputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "prefix"
  > {
  fullWidth?: boolean;
  helperText?: React.ReactElement;
  prefix?: React.ReactElement;
  suffix?: React.ReactElement;
}

const inputContainerClasses = cva("relative rounded-md", {
  variants: {
    fullWidth: {
      true: "w-full",
    },
    disabled: {
      true: "bg-gray-50 text-gray-300",
      false: "text-gray-900",
    },
    hasLabel: {
      true: "mt-1.5",
      false: "",
    },
  },
  defaultVariants: {
    fullWidth: false,
    disabled: false,
    hasLabel: false,
  },
});

export const inputClasses = cva(
  [
    "block w-full rounded-md border border-gray-300 py-2 shadow-sm bg-transparent placeholder:text-gray-500",
    "focus:border-indigo-300 focus:outline-0 focus:ring-4 focus:ring-indigo-100 focus:ring-offset-0",
  ],
  {
    variants: {
      hasPrefix: {
        true: "pl-3",
      },
      hasSuffix: {
        true: "pr-3",
      },
    },
    defaultVariants: {
      hasPrefix: false,
      hasSuffix: false,
    },
  },
);

const Input = React.forwardRef(
  (
    {
      children,
      className,
      disabled,
      fullWidth,
      helperText,
      name,
      id = name,
      prefix,
      suffix,
      type = "text",
      ...restProps
    }: InputProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const prefixRef = useRef<HTMLSpanElement>(null);
    const suffixRef = useRef<HTMLSpanElement>(null);

    const inputPaddingLeft = prefixRef.current
      ? Math.round(prefixRef.current.getBoundingClientRect().width) + 4
      : "";
    const inputPaddingRight = suffixRef.current
      ? Math.round(suffixRef.current.getBoundingClientRect().width) + 4
      : "";

    return (
      <div className={cx(fullWidth ? "w-full" : "")}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {children}
        </label>

        <div
          className={cx([
            inputContainerClasses({
              className,
              disabled,
              fullWidth,
              hasLabel: !!children,
            }),
          ])}
        >
          {prefix ? (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              ref={prefixRef}
            >
              <prefix.type {...prefix.props} />
            </span>
          ) : null}

          <input
            style={{
              paddingLeft: inputPaddingLeft,
              paddingRight: inputPaddingRight,
            }}
            type={type}
            name={name}
            id={id}
            disabled={disabled}
            className={inputClasses({
              hasPrefix: !!prefix,
              hasSuffix: !!suffix,
            })}
            ref={ref}
            {...restProps}
          />

          {suffix ? (
            <span
              className="absolute inset-y-0 right-0 flex items-center"
              ref={suffixRef}
            >
              <suffix.type {...suffix.props} />
            </span>
          ) : null}
        </div>

        {helperText ? (
          <div className="mt-1.5 text-sm text-gray-600">{helperText}</div>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;

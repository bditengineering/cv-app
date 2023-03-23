import { cva } from "class-variance-authority";

interface CheckboxProps {
  checked: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  supportingText?: React.ReactNode;
}

const checkboxClasses = cva(
  [
    "checkbox",
    "h-5 w-5 rounded-md border-gray-300",
    "focus:border-indigo-300 focus:ring-indigo-600",
  ],
  {
    variants: {
      disabled: {
        true: "text-gray-300",
        false: "text-indigo-600",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

const Checkbox = ({
  checked,
  children,
  className,
  disabled,
  name,
  onChange,
  supportingText,
}: CheckboxProps) => {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          checked={checked}
          className={checkboxClasses({ disabled, className })}
          disabled={disabled}
          id={name}
          name={name}
          onChange={onChange}
          type="checkbox"
        />
      </div>

      <div className="ml-2 text-sm leading-5">
        <label htmlFor={name} className="font-medium text-gray-700">
          {children}
        </label>

        {supportingText ? (
          <p className="text-gray-600">{supportingText}</p>
        ) : null}
      </div>
    </div>
  );
};

export default Checkbox;

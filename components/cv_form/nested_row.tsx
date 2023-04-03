import React from "react";
import { cx } from "class-variance-authority";
import { Field, FieldArray } from "formik";
import * as Icons from "@ui/icons";
import Input from "@ui/input";
import Button from "@ui/button";

interface Props {
  fProps: any;
  outerIndex: number;
  outerArray: string;
  innerArray: string;
}

interface RemoveButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const RemoveInputSuffix = ({ onClick }: RemoveButtonProps) => (
  <Button
    className={cx([
      // add left border and remove radius
      // + add 1px margin (width of border) so container's border is not overlapped on hover and focus
      "m-px rounded-l-none border-l border-l-gray-300",
      "focus:m-0 focus:border focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
    ])}
    onClick={onClick}
    variant="plain"
  >
    <Icons.TrashCan className="h-5 w-5" />
    <span className="hidden sm:inline">Remove</span>
  </Button>
);

export default function NestedRow({
  fProps,
  outerIndex,
  outerArray,
  innerArray,
}: Props) {
  return (
    <FieldArray
      name={`[${outerArray}][${outerIndex}][${innerArray}]`}
      render={(arrayHelpers) => (
        <div>
          {fProps.values[outerArray][outerIndex][innerArray] &&
            fProps.values[outerArray][outerIndex][innerArray].length > 0 &&
            fProps.values[outerArray][outerIndex][innerArray].map(
              (item: any, itemIndex: any) => (
                <div key={itemIndex} className="mb-2 flex w-full">
                  <Field
                    as={Input}
                    fullWidth
                    name={`[${outerArray}][${outerIndex}][${innerArray}].${itemIndex}`}
                    suffix={
                      <RemoveInputSuffix
                        onClick={() => arrayHelpers.remove(itemIndex)}
                      />
                    }
                  />
                </div>
              ),
            )}
          <button
            className="flex text-indigo-500"
            type="button"
            onClick={() => arrayHelpers.push("")}
          >
            <Icons.PlusCircle />
            <span>Add</span>
          </button>
        </div>
      )}
    />
  );
}

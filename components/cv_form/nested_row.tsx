import React from "react";
import { ErrorMessage, Field, FieldArray } from "formik";
import * as Icons from "@ui/icons";
import Input from "@ui/input";
import RemoveInputAction from "./remove_input_action";
import type { PrefixSuffixRenderProps } from "@ui/input";

interface Props {
  fProps: any;
  outerIndex: number;
  outerArray: string;
  innerArray: string;
}

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
                    autoFocus
                    fullWidth
                    name={`[${outerArray}][${outerIndex}][${innerArray}].${itemIndex}`}
                    renderSuffix={({ disabled }: PrefixSuffixRenderProps) => (
                      <RemoveInputAction
                        disabled={disabled}
                        onClick={() => arrayHelpers.remove(itemIndex)}
                      />
                    )}
                  />
                </div>
              ),
            )}
          <button
            className="flex gap-1 text-indigo-500"
            type="button"
            onClick={() => arrayHelpers.push("")}
          >
            <Icons.PlusCircle />
            <span>Add</span>
          </button>
          <ErrorMessage
            className="w-full text-red-600"
            name={`${outerArray}[${outerIndex}].${innerArray}`}
            component="span"
          />
        </div>
      )}
    />
  );
}

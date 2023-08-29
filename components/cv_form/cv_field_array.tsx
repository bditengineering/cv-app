import { Field, FieldArray } from "formik";
import * as Icons from "@ui/icons";
import type { PrefixSuffixRenderProps } from "@ui/input";
import Input from "@ui/input";
import RemoveInputAction from "./remove_input_action";

interface Props {
  fProps: any;
  title: string;
  fieldArrayName: string;
}

export default function CvFieldArray({ fProps, title, fieldArrayName }: Props) {
  return (
    <div className="flex flex-wrap py-8 md:flex-nowrap">
      <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
        <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
          {title}
        </span>
      </div>
      <div className="md:flex-grow">
        <FieldArray
          name={fieldArrayName}
          render={(arrayHelpers: any) => (
            <div>
              {fProps.values &&
                fProps.values[fieldArrayName] &&
                fProps.values[fieldArrayName].length > 0 &&
                fProps.values[fieldArrayName].map((item: any, index: any) => (
                  <div key={index} className="mb-2 flex w-full">
                    <Field
                      as={Input}
                      autoFocus
                      fullWidth
                      name={`${fieldArrayName}.${index}`}
                      renderSuffix={({ disabled }: PrefixSuffixRenderProps) => (
                        <RemoveInputAction
                          disabled={disabled}
                          onClick={() => arrayHelpers.remove(index)}
                        />
                      )}
                    />
                  </div>
                ))}
              <button
                type="button"
                onClick={() => arrayHelpers.push("")}
                className="flex gap-1 text-indigo-500"
              >
                <Icons.PlusCircle />
                <span>Add</span>
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

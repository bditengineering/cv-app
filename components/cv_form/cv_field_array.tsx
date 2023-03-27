import { Field, FieldArray } from "formik";
import * as Icons from "@ui/icons";

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
          render={(arrayHelpers) => (
            <div>
              {fProps.values &&
                fProps.values[fieldArrayName] &&
                fProps.values[fieldArrayName].length > 0 &&
                fProps.values[fieldArrayName].map((item: any, index: any) => (
                  <div key={index} className="mb-2 flex w-full">
                    <Field
                      name={`${fieldArrayName}.${index}`}
                      className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                    />
                    <button
                      className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                      type="button"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      <Icons.TrashCan />
                    </button>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => arrayHelpers.push("")}
                className="flex text-indigo-500"
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

import { Field, FieldArray, FormikProps } from "formik";
import { CV } from "../../utils/types";
import * as Icons from "../Icons";

interface CvFieldArrayProps {
  formProps: FormikProps<CV>;
  title: string;
  fieldArrayName: "personal_qualities";
}

export default function CvFieldArray({
  formProps,
  title,
  fieldArrayName,
}: CvFieldArrayProps) {
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
              {formProps.values &&
                formProps.values[fieldArrayName] &&
                formProps.values[fieldArrayName].length > 0 &&
                formProps.values[fieldArrayName].map(
                  (item: string, index: number) => (
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
                  ),
                )}
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

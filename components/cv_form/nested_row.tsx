import { Field, FieldArray, FormikProps } from "formik";
import * as Icons from "../Icons";
import { CV } from "../../utils/types";

interface NestedRowProps {
  // formProps: FormikProps<CV>;
  // TODO: figure out dynamic/generic type for formProps, outerArray, innerArray
  formProps: any;
  outerIndex: number;
  outerArray: string;
  innerArray: string;
}

export default function NestedRow({
  formProps,
  outerIndex,
  outerArray,
  innerArray,
}: NestedRowProps) {
  return (
    <FieldArray
      name={`[${outerArray}][${outerIndex}][${innerArray}]`}
      render={(arrayHelpers) => (
        <div>
          {formProps.values[outerArray][outerIndex][innerArray] &&
            formProps.values[outerArray][outerIndex][innerArray].length > 0 &&
            formProps.values[outerArray][outerIndex][innerArray].map(
              (item: string, itemIndex: number) => (
                <div key={itemIndex} className="mb-2 flex w-full">
                  <Field
                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                    name={`[${outerArray}][${outerIndex}][${innerArray}].${itemIndex}`}
                  />
                  <button
                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                    type="button"
                    onClick={() => arrayHelpers.remove(itemIndex)}
                  >
                    <Icons.TrashCan />
                  </button>
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

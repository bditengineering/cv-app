import { Field, FieldArray } from "formik";
import * as Icons from "@ui/icons";

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

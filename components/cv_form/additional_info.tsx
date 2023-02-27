import { Field, FieldArray, FormikProps } from "formik";
import CvFieldArray from "./cv_field_array";
import * as Icons from "../Icons";
import type { Certification, FullCv } from "../../types";

interface AdditionalInfoProps {
  formProps: FormikProps<FullCv<"Update">>;
}

export function AdditionalInfo({ formProps }: AdditionalInfoProps) {
  return (
    <div>
      <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
        Additional
      </h2>

      <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
        <div className="flex flex-wrap py-8 md:flex-nowrap">
          <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
            <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
              Certifications
            </span>
          </div>
          <div className="md:flex-grow">
            <FieldArray
              name={"certifications"}
              render={(arrayHelpers) => (
                <div>
                  {formProps.values?.["certifications"]?.length > 0 &&
                    formProps.values["certifications"].map(
                      (item: Certification<"Update">, index: number) => (
                        <div key={index} className="py-2">
                          <div className="mb-2 flex w-full">
                            <Field
                              name={`certifications.${index}.certificate_name`}
                              className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                              placeholder="name"
                            />
                          </div>
                          <div className="mb-2 flex w-full">
                            <Field
                              name={`certifications.${index}.description`}
                              className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                              placeholder="description"
                            />
                          </div>
                          <button
                            className="rounded-md border border-indigo-500 bg-indigo-500 p-1 text-white float-right"
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

        <CvFieldArray
          formProps={formProps}
          title={"Personal Qualities"}
          fieldArrayName={"personal_qualities"}
        />
      </div>
    </div>
  );
}

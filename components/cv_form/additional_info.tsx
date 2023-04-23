import { Field, FieldArray } from "formik";
import CvFieldArray from "./cv_field_array";
import * as Icons from "@ui/icons";
import Input from "@ui/input";
import Button from "@ui/button";

interface AdditionalInfoProps {
  formProps: any;
  setCertificationsToRemove: (cb: (prevState: string[]) => string[]) => void;
}

export function AdditionalInfo({
  formProps,
  setCertificationsToRemove,
}: AdditionalInfoProps) {
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
                      (certification: any, index: any) => (
                        <div key={index} className="py-2">
                          <div className="mb-2 flex w-full">
                            <Field
                              as={Input}
                              autoFocus
                              fullWidth
                              name={`certifications.${index}.certificate_name`}
                              placeholder="Certificate name"
                            />
                          </div>
                          <div className="mb-2 flex w-full">
                            <Field
                              as={Input}
                              fullWidth
                              name={`certifications.${index}.description`}
                              placeholder="Certificate description"
                            />
                          </div>
                          <Button
                            className="ml-auto"
                            variant="outlined"
                            onClick={() => {
                              arrayHelpers.remove(index);
                              setCertificationsToRemove((prevIds) => [
                                ...prevIds,
                                certification.id,
                              ]);
                            }}
                            prefix={<Icons.TrashCan className="h-5 w-5" />}
                          >
                            Remove certificate
                          </Button>
                        </div>
                      ),
                    )}
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

        <CvFieldArray
          fProps={formProps}
          title={"Personal Qualities"}
          fieldArrayName={"personal_qualities"}
        />
      </div>
    </div>
  );
}

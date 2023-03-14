import { Field, FieldArray } from "formik";
import * as Icons from "../Icons";

import * as Options from "../../constants/CvFormOptions";

interface EducationProps {
  fProps: any;
  setEducationsToRemove: (cb: (prevState: string[]) => string[]) => void;
}

export function Education({ fProps, setEducationsToRemove }: EducationProps) {
  return (
    <FieldArray
      name="educations"
      render={(arrayHelpers) => (
        <div>
          <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
            Education
          </h2>
          {fProps.values.educations &&
            fProps.values.educations.length > 0 &&
            fProps.values.educations.map(
              (education: any, educationIndex: any) => (
                <div
                  key={education?.id || educationIndex}
                  className="-my-8 mb-10 mt-2 divide-y-2 divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-400 dark:border-gray-700 px-6"
                >
                  <div className="flex flex-wrap py-8 md:flex-nowrap">
                    <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                      <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                        University
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <Field
                        className="w-full rounded-md"
                        name={`educations[${educationIndex}].university_name`}
                        type="text"
                        placeholder="Name of University"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap py-8 md:flex-nowrap">
                    <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                      <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                        Degree
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <Field
                        className="w-full rounded-md"
                        name={`educations[${educationIndex}].degree`}
                        type="text"
                        as="textarea"
                        placeholder="Degree"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap py-8 md:flex-nowrap">
                    <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                      <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                        Duration
                      </span>
                    </div>
                    <div className="md:flex-grow">
                      <label className="dark:text-gray-400">From</label>
                      <Field
                        as="select"
                        name={`educations[${educationIndex}].start_year`}
                        className="rounded-md ml-2 mr-6"
                      >
                        <option />
                        {Options.yearsOptions.map((year) => (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        ))}
                      </Field>

                      <label className="dark:text-gray-400">Until</label>
                      <Field
                        as="select"
                        name={`educations[${educationIndex}].end_year`}
                        className="rounded-md mx-2"
                      >
                        <option />
                        {Options.yearsOptions.map((year) => (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="flex flex-wrap py-8 md:flex-nowrap">
                    <button
                      className="flex text-indigo-500"
                      type="button"
                      onClick={() => {
                        arrayHelpers.remove(educationIndex);
                        setEducationsToRemove((prevIds) => [
                          ...prevIds,
                          education.id,
                        ]);
                      }}
                    >
                      <Icons.TrashCan />
                      Remove Education
                    </button>
                  </div>
                </div>
              ),
            )}
          <button
            className="flex flex-wrap text-indigo-500"
            type="button"
            onClick={() => arrayHelpers.push({})}
          >
            <Icons.PlusCircle />
            <span>Add Education</span>
          </button>
        </div>
      )}
    />
  );
}

import { Field, FieldArray } from "formik";
import * as Icons from "../Icons";
import * as Options from "../../constants/CvFormOptions";
import NestedRow from "./nested_row";

interface Props {
  fProps: any;
}

export default function Projects({ fProps }: Props) {
  return (
    <FieldArray
      name="projects"
      render={(arrayHelpers) => (
        <div>
          {fProps.values.projects &&
            fProps.values.projects.length > 0 &&
            fProps.values.projects.map((project: any, projectsIndex: any) => (
              <div
                key={projectsIndex}
                className="-my-8 mb-10 mt-2 divide-y-2 divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-400 dark:border-gray-700 px-6"
              >
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Project Name
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name={`projects[${projectsIndex}].name`}
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Project Description
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name={`projects[${projectsIndex}].description`}
                      type="text"
                      as="textarea"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Field
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name={`projects[${projectsIndex}].field`}
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Size of the team
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name={`projects[${projectsIndex}].team_size`}
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Position
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name={`projects[${projectsIndex}].position`}
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Tools & Technologies
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <NestedRow
                      fProps={fProps}
                      outerIndex={projectsIndex}
                      outerArray="projects"
                      innerArray="technologies"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Responsibilities
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <NestedRow
                      fProps={fProps}
                      outerIndex={projectsIndex}
                      outerArray="projects"
                      innerArray="responsibilities"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      From
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as="select"
                      name={`projects[${projectsIndex}].from_month`}
                      className="rounded-md w-1/2 mr-2"
                    >
                      <option />
                      {Options.monthsOptions.map((month) => (
                        <option value={month.value} key={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Field>
                    <Field
                      as="select"
                      name={`projects[${projectsIndex}].from_year`}
                      className="rounded-md w-1/3"
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
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Until
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as="select"
                      name={`projects[${projectsIndex}].until_month`}
                      className="rounded-md w-1/2 mr-2"
                    >
                      <option />
                      {Options.monthsOptions.map((month) => (
                        <option value={month.value} key={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Field>
                    <Field
                      as="select"
                      name={`projects[${projectsIndex}].until_year`}
                      className="rounded-md w-1/3"
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
                    onClick={() => arrayHelpers.remove(projectsIndex)}
                  >
                    <Icons.TrashCan />
                    Remove Project
                  </button>
                </div>
              </div>
            ))}
          <button
            className="flex flex-wrap text-indigo-500"
            type="button"
            onClick={() => arrayHelpers.push({})}
          >
            <Icons.PlusCircle />
            <span>Add Project</span>
          </button>
        </div>
      )}
    />
  );
}

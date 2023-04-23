import { Field, FieldArray } from "formik";
import * as Icons from "@ui/icons";
import NestedRow from "./nested_row";
import { MonthYearDatePicker } from "../datepicker";
import Input, { inputClasses } from "@ui/input";

interface Props {
  fProps: any;
  setProjectsToRemove: (cb: (prevState: string[]) => string[]) => void;
}

export default function Projects({ fProps, setProjectsToRemove }: Props) {
  return (
    <FieldArray
      name="projects"
      render={(arrayHelpers) => (
        <div>
          <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
            Projects
          </h2>
          {fProps.values.projects &&
            fProps.values.projects.length > 0 &&
            fProps.values.projects.map((project: any, projectsIndex: any) => (
              <div
                key={projectsIndex}
                className="-my-8 mb-10 mt-2 divide-y-2 divide-gray-100 rounded-md border border-gray-400 px-6 dark:divide-gray-700 dark:border-gray-700"
              >
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Project Name
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      as={Input}
                      autoFocus
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
                      as="textarea"
                      className={inputClasses({ className: "text-gray-900" })}
                      name={`projects[${projectsIndex}].description`}
                      type="text"
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
                      as={Input}
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
                      as={Input}
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
                      as={Input}
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
                    <MonthYearDatePicker
                      name={`projects[${projectsIndex}].date_start`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Until
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <MonthYearDatePicker
                      name={`projects[${projectsIndex}].date_end`}
                      disabled={project.ongoing}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Ongoing
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="flex text-indigo-500"
                      name={`projects[${projectsIndex}].ongoing`}
                      type="checkbox"
                      checked={project.ongoing}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <button
                    className="flex gap-1 text-indigo-500"
                    type="button"
                    onClick={() => {
                      arrayHelpers.remove(projectsIndex);
                      setProjectsToRemove((prevIds) => [
                        ...prevIds,
                        project.id,
                      ]);
                    }}
                  >
                    <Icons.TrashCan />
                    Remove Project
                  </button>
                </div>
              </div>
            ))}
          <button
            className="flex flex-wrap gap-1 text-indigo-500"
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

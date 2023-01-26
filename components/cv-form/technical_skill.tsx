import { Field, FieldArray } from "formik";
import * as Icons from "../Icons";

interface Props {
  fProps: any;
}

export default function TechnicalSkill({ fProps }: Props) {
  return (
    <FieldArray
      name="technical_skills"
      render={(arrayHelpers) => (
        <div>
          {fProps.values.technical_skills &&
            fProps.values.technical_skills.length > 0 &&
            fProps.values.technical_skills.map((item: any, index: any) => (
              <div
                key={index}
                className="-my-8 mb-10 mt-2 divide-y-2 divide-gray-100 dark:divide-gray-700 rounded-md border border-gray-400 dark:border-gray-700 px-6"
              >
                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Skill Group Name
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <Field
                      className="w-full rounded-md"
                      name={`technical_skills[${index}].name`}
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                    <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
                      Skills
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    <FieldArray
                      name={`technical_skills[${index}].skills`}
                      render={(arrayHelpers) => (
                        <div>
                          {fProps.values.technical_skills[index].skills &&
                            fProps.values.technical_skills[index].skills
                              .length > 0 &&
                            fProps.values.technical_skills[index].skills.map(
                              (skill: any, skillIndex: any) => (
                                <div
                                  key={skillIndex}
                                  className="mb-2 flex w-full"
                                >
                                  <Field
                                    className="mr-1 w-full rounded-md border border-gray-500 p-1 dark:bg-white"
                                    name={`technical_skills[${index}].skills.${skillIndex}`}
                                  />
                                  <button
                                    className="rounded-md border border-indigo-500 bg-indigo-500 p-1  text-white"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.remove(skillIndex)
                                    }
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
                  </div>
                </div>

                <div className="flex flex-wrap py-8 md:flex-nowrap">
                  <button
                    className="flex text-indigo-500"
                    type="button"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <Icons.TrashCan />
                    Remove
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
            <span>Add Skill Group</span>
          </button>
        </div>
      )}
    />
  );
}

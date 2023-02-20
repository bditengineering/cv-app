import { Field, FieldArray } from "formik";
import * as Icons from "../Icons";
import NestedRow from "./nested_row";

interface Props {
  fProps: any;
}

export default function TechnicalSkill({ fProps }: Props) {
  return (
    <FieldArray
      name="technical_skills"
      render={(arrayHelpers) => (
        <div>
          <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
            Technical skills
          </h2>
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
                    <NestedRow
                      fProps={fProps}
                      outerIndex={index}
                      outerArray="technical_skills"
                      innerArray="skills"
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

import { Field, ErrorMessage } from "formik";
import type { TitlesResponse } from "../types";
import Input, { inputClasses } from "@ui/input";

interface Props {
  fProps: any;
  titles: Array<TitlesResponse>;
}

export function PersonalInfo({ fProps, titles }: Props) {
  return (
    <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
      <div className="flex flex-wrap py-8 md:flex-nowrap">
        <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
          <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
            Name
          </span>
        </div>
        <div className="flex md:flex-grow">
          <div className="inline-block w-1/2 pr-1">
            <Field
              as={Input}
              name="first_name"
              type="text"
              placeholder="First Name"
            />
            <ErrorMessage
              className="w-full text-red-600"
              name="first_name"
              component="span"
            />
          </div>
          <div className="inline-block w-1/2 pl-1">
            <Field
              as={Input}
              name="last_name"
              type="text"
              placeholder="Last Name"
            />
            <ErrorMessage
              className="w-full text-red-600"
              name="last_name"
              component="span"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap py-8 md:flex-nowrap">
        <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
          <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
            Title
          </span>
        </div>
        <div className="md:flex-grow">
          <Field as="select" name="title_id" className="rounded-md">
            <option disabled value="">
              Choose title
            </option>

            {titles.map((option, index: number) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
          </Field>
          <ErrorMessage
            className="w-full text-red-600"
            name="title_id"
            component="span"
          />
        </div>
      </div>

      <div className="flex flex-wrap py-8 md:flex-nowrap">
        <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
          <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
            Summary of Qualification
          </span>
        </div>
        <div className="md:flex-grow">
          <Field
            className={inputClasses({ className: "text-gray-900" })}
            name="summary"
            type="text"
            as="textarea"
            rows={4}
          />
          <ErrorMessage
            className="w-full text-red-600"
            name="summary"
            component="span"
          />
        </div>
      </div>
    </div>
  );
}

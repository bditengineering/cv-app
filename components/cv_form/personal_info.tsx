import { Field, ErrorMessage } from "formik";

export function PersonalInfo() {
  return (
    <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
      <div className="flex flex-wrap py-8 md:flex-nowrap">
        <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
          <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
            Name
          </span>
        </div>
        <div className="md:flex-grow flex">
          <div className="w-1/2 inline-block pr-1">
            <Field
              className="rounded-md w-full"
              name="first_name"
              type="text"
              placeholder="First Name"
            />
            <ErrorMessage
              className="text-red-600 w-full"
              name="first_name"
              component="span"
            />
          </div>
          <div className="w-1/2 inline-block pl-1">
            <Field
              className="rounded-md w-full"
              name="last_name"
              type="text"
              placeholder="Last Name"
            />
            <ErrorMessage
              className="text-red-600 w-full"
              name="last_name"
              component="span"
            />
          </div>
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
            className="w-full rounded-md"
            name="summary"
            type="text"
            as="textarea"
          />
        </div>
      </div>
    </div>
  );
}

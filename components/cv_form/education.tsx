import { Field } from "formik";
import * as Options from "../../constants/CvFormOptions";

export function Education() {
  return (
    <div>
      <h2 className="my-10 text-2xl font-bold dark:text-gray-300">Education</h2>

      <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
        <div className="flex flex-wrap py-8 md:flex-nowrap">
          <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
            <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
              University
            </span>
          </div>
          <div className="md:flex-grow">
            <Field
              className="w-full rounded-md"
              name="education.university_name"
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
              name="education.degree"
              type="text"
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
              name="education.start_year"
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
              name="education.end_year"
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
      </div>
    </div>
  );
}

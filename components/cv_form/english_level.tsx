import { Field, ErrorMessage } from "formik";
import { ENGLISH_LEVELS } from "../../constants/form_options";

export function EnglishLevel() {
  return (
    <div>
      <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
        Level of English
      </h2>

      <div className="-my-8 divide-y-2 divide-gray-100 dark:divide-gray-700">
        <div className="flex flex-wrap py-8 md:flex-nowrap">
          <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
            <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
              Spoken
            </span>
          </div>
          <div className="md:flex-grow">
            <Field
              as="select"
              name="english_spoken_level"
              className="w-full rounded-md"
            >
              <option />
              {ENGLISH_LEVELS.map((level) => (
                <option value={level.value} key={level.value}>
                  {level.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              className="text-red-600 w-full"
              name="english_spoken_level"
              component="span"
            />
          </div>
        </div>
        <div className="flex flex-wrap py-8 md:flex-nowrap">
          <div className="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
            <span className="title-font font-semibold text-gray-700 dark:text-gray-400">
              Written
            </span>
          </div>
          <div className="md:flex-grow">
            <Field
              as="select"
              name="english_written_level"
              className="w-full rounded-md"
            >
              <option />
              {ENGLISH_LEVELS.map((level) => (
                <option value={level.value} key={level.value}>
                  {level.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              className="text-red-600 w-full"
              name="english_written_level"
              component="span"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

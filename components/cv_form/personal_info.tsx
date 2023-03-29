import { Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import type { Title } from "../types";

interface Props {
  fProps: any;
}

export function PersonalInfo({ fProps }: Props) {
  // TODO: don't manually mutate formik values and move state to parent component
  const availableTitles = fProps.values.availableTitles;

  const [title, setTitle] = useState<string>();

  const handleTitleChange = (event: any) => {
    const title = fProps.values.availableTitles.find(
      (title: any) => title.title === event.target.value,
    );
    setTitle(event.target.value);
    fProps.values.title_id = title.id;
    fProps.values.titles = title;
  };

  useEffect(() => {
    if (availableTitles.length === 0) return;
    const currentTitle = fProps.values.titles
      ? fProps.values.titles
      : availableTitles[0];
    fProps.values.title_id = currentTitle.id;
    fProps.values.titles = currentTitle;
    setTitle(currentTitle.title);
  }, [availableTitles]);

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
              className="w-full rounded-md"
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
              className="w-full rounded-md"
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
          <select
            className="rounded-md"
            value={title}
            onChange={handleTitleChange}
          >
            {fProps.values.availableTitles.map(
              (option: Title, index: number) => (
                <option key={index} value={option.name} label={option.name} />
              ),
            )}
          </select>
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

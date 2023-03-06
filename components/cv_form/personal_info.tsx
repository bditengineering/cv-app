import { Field, Dropdown, ErrorMessage } from "formik";
import { useEffect, useState } from "react";

interface Props {
  fProps: any;
}

export function PersonalInfo({ fProps }: Props) {
  const [position, setSpecialty] = useState<string>();
  const handleSpecialtyChange = (event: any) => {
    const position = fProps.values.availablePositions.find((position: any) => position.title === event.target.value);
    setSpecialty(event.target.value);
    fProps.values.position_id = position.id;
    fProps.values.positions = position;
  };

  useEffect(() => {
    const currentPosition = fProps.values.positions ? fProps.values.positions.title : fProps.values.availablePositions[0]?.title;
    setSpecialty(currentPosition)
  }, [fProps]);
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
            Specialty
          </span>
        </div>
        <div className="md:flex-grow">
          <select className="rounded-md" value={position} onChange={handleSpecialtyChange}>
            {fProps.values.availablePositions.map((option: any, index: number) => (
              <option key={index} value={option.title} label={option.title} />
            ))}
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

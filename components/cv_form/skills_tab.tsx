import { ChangeEvent } from "react";
import { FieldArray, FieldArrayRenderProps } from "formik";
import Checkbox from "@ui/checkbox";
import { Tab } from "@headlessui/react";

interface SkillsTabProps {
  fProps: any;
  skills: {
    [key: string]: {
      group_name: string;
      skills: Array<{ id: string; name: string }>;
    };
  };
}

export default function SkillsTab({ fProps, skills }: SkillsTabProps) {
  const isChecked = (skill: { id: string; name: string }) =>
    fProps.values.cv_skill.some(
      (cvSkill: { id?: string; skill_id: string; cv_id?: string }) =>
        cvSkill.skill_id === skill.id,
    );

  const onChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    arrayHelpers: FieldArrayRenderProps,
    skill: { id: string; name: string },
  ) => {
    if (event.target.checked) {
      arrayHelpers.push({ skill_id: skill.id });
    } else {
      const index = fProps.values.cv_skill.findIndex(
        (cvSkill: any) => cvSkill.skill_id === skill.id,
      );
      arrayHelpers.remove(index);
    }
  };

  return (
    <Tab.Group>
      <Tab.List className="bg-gray-50 border-solid border-1 border-gray-100 rounded-lg p-1 mb-5 gap-2 flex flex-row items-center">
        {Object.entries(skills).map(([id, group]) => (
          <Tab
            key={id}
            className="aria-selected:bg-white aria-selected:text-gray-700 aria-selected:font-medium aria-selected:rounded-md aria-selected:shadow px-2 py-3 text-gray-500 outline-none"
          >
            {group.group_name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        <FieldArray
          name="cv_skill"
          render={(arrayHelpers) => (
            <div>
              {Object.entries(skills).map(([id, group]) => (
                <Tab.Panel
                  key={id}
                  className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                >
                  {group.skills.map((skill) => (
                    <Checkbox
                      checked={isChecked(skill)}
                      key={skill.id}
                      name={"cv_skill-" + skill.id}
                      onChange={(event) =>
                        onChangeHandler(event, arrayHelpers, skill)
                      }
                    >
                      {skill.name}
                    </Checkbox>
                  ))}
                </Tab.Panel>
              ))}
            </div>
          )}
        />
      </Tab.Panels>
    </Tab.Group>
  );
}

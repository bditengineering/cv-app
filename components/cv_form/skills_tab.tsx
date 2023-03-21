import { Tab } from "@headlessui/react";
import { FieldArray, FieldArrayRenderProps } from "formik";
import { ChangeEvent } from "react";

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
      <Tab.List>
        {Object.entries(skills).map(([id, group]) => {
          return (
            <Tab className="mb-5 mr-5" key={id}>
              {group.group_name}
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        <FieldArray
          name="cv_skill"
          render={(arrayHelpers) => (
            <div>
              {Object.entries(skills).map(([id, group]) => (
                <Tab.Panel key={id}>
                  {group.skills.map((skill) => (
                    <label key={skill.id}>
                      <input
                        name="cv_skill"
                        type="checkbox"
                        checked={isChecked(skill)}
                        onChange={(event) =>
                          onChangeHandler(event, arrayHelpers, skill)
                        }
                      />
                      {skill.name}
                    </label>
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

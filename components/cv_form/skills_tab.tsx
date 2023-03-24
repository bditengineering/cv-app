import { ChangeEvent } from "react";
// import { Tab } from "@headlessui/react";
import { FieldArray, FieldArrayRenderProps } from "formik";
import Checkbox from "@ui/checkbox";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@ui/tab";

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
    <TabGroup>
      <TabList>
        {Object.entries(skills).map(([id, group]) => (
          <Tab key={id}>{group.group_name}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <FieldArray
          name="cv_skill"
          render={(arrayHelpers) => (
            <>
              {Object.entries(skills).map(([id, group]) => (
                <TabPanel key={id}>
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
                </TabPanel>
              ))}
            </>
          )}
        />
      </TabPanels>
    </TabGroup>
  );
}

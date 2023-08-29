import type { ChangeEvent } from "react";
import type { FieldArrayRenderProps } from "formik";
import { FieldArray } from "formik";
import Checkbox from "@ui/checkbox";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@ui/tab";
import type { SkillGroup, Skill, CvSkillResponse } from "../types";

interface SkillsTabProps {
  fProps: any;
  skills: SkillGroup;
}

export default function SkillsTab({ fProps, skills }: SkillsTabProps) {
  const isChecked = (skill: Skill) =>
    fProps.values.cv_skill.some(
      (cvSkill: CvSkillResponse) => cvSkill.skill_id === skill.id,
    );

  const onChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    arrayHelpers: FieldArrayRenderProps,
    skill: Skill,
  ) => {
    if (event.target.checked) {
      arrayHelpers.push({ skill_id: skill.id });
    } else {
      const index = fProps.values.cv_skill.findIndex(
        (cvSkill: CvSkillResponse) => cvSkill.skill_id === skill.id,
      );
      arrayHelpers.remove(index);
    }
  };

  return (
    <TabGroup>
      <TabList>
        {Object.values(skills).map((skillGroup: SkillGroup[number]) => (
          <Tab key={skillGroup.group_name}>{skillGroup.group_name}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <FieldArray
          name="cv_skill"
          render={(arrayHelpers: any) => (
            <>
              {Object.values(skills).map((skillGroup: SkillGroup[number]) => (
                <TabPanel
                  className="grid gap-3 px-1.5 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
                  key={skillGroup.group_name}
                >
                  {skillGroup.skills.map((skill) => (
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

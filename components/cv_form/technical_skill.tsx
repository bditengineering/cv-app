import { SkillGroup } from "../types";
import SkillsTab from "./skills_tab";

interface Props {
  fProps: any;
  skills: SkillGroup;
}

export default function TechnicalSkill({ fProps, skills }: Props) {
  console.log(skills);
  return (
    <div>
      <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
        Technical skills
      </h2>
      <SkillsTab fProps={fProps} skills={skills} />
    </div>
  );
}

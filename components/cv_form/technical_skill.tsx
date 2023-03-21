import SkillsTab from "./skills_tab";

interface Props {
  fProps: any;
  skills: {
    [key: string]: {
      group_name: string;
      skills: Array<{ id: string; name: string }>;
    };
  };
}

export default function TechnicalSkill({ fProps, skills }: Props) {
  return (
    <div>
      <h2 className="my-10 text-2xl font-bold dark:text-gray-300">
        Technical skills
      </h2>
      <SkillsTab fProps={fProps} skills={skills} />
    </div>
  );
}

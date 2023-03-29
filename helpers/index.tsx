import type { SkillGroup, SkillResponse } from "../components/types";

export function transformSkills(response: SkillResponse[] | null) {
  if (response == null) return {};

  return response.reduce<SkillGroup>((acc, skill) => {
    const group_id = skill.skill_group.id;

    if (!acc[group_id]) {
      acc[group_id] = {
        group_name: skill.skill_group.name,
        skills: [],
      };
    }

    acc[group_id].skills.push({
      name: skill.name,
      id: skill.id,
    });

    return acc;
  }, {});
}

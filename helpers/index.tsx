import type { SkillGroup, SkillResponse } from "../components/types";

export function transformSkills(response: SkillResponse[] | null) {
  if (response == null) return {};

  return response.reduce<SkillGroup>((acc, skill) => {
    const group_name = skill.skill_group.name;

    if (!acc[group_name]) {
      acc[group_name] = [];
    }

    acc[group_name].push({
      name: skill.name,
      id: skill.id,
    });

    return acc;
  }, {});
}

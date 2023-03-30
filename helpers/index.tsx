import type { SkillGroup, SkillResponse } from "../components/types";

export function transformSkills(response: SkillResponse[] | null) {
  if (response == null) return {};

  return response.reduce<SkillGroup>((acc, skill) => {
    const order = skill.skill_group.order;

    if (!acc[order]) {
      acc[order] = { group_name: skill.skill_group.name, skills: [] };
    }

    acc[order].skills.push({
      name: skill.name,
      id: skill.id,
    });

    return acc;
  }, {});
}

import type { SkillGroup, SkillResponse } from "../components/types";

export function transformSkills(response: SkillResponse[] | null) {
  if (response == null) return {};

  return response.reduce<SkillGroup>((acc, skill) => {
    const order = skill.skill_group.order;

    if (!acc[order]) {
      acc[order] = {
        group_name: skill.skill_group.name,
        skills: [],
      };
    }

    acc[order].skills.push({
      name: skill.name,
      id: skill.id,
    });

    return acc;
  }, {});
}

export function transformCv(response: any | null) {
  if (response == null) return {};

  response.projects = response.projects.map((project: any) => {
    return {
      ...project,
      date_start: new Date(project.date_start),
      date_end: new Date(project.date_end),
      // team_size: project.team_size || "",
      // date_start: project.date_start ? new Date(project.date_start) : "",
      // date_end: project.date_end ? new Date(project.date_end) : "",
    };
  });

  return response;
}

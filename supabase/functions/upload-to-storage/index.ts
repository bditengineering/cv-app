// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import jsPDF from "https://esm.sh/jspdf@2.5.1?target=deno&no-check";
import autoTable from "https://esm.sh/jspdf-autotable@3.5.28?target=deno&no-check";
import { corsHeaders } from "../_shared/cors.ts";

const transformSkillsBySkillGroup = (skills) => {
  return skills.reduce((acc, element) => {
    const group_name = element.skill.skill_group.name;

    if (!acc[group_name]) {
      acc[group_name] = [];
    }

    acc[group_name].push(element.skill.name);

    return acc;
  }, {});
};

serve(async function handler(req: Request) {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { id } = await req.json();

    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data, error } = await supabaseClient
      .from("cv")
      .select(
        "*, projects(*), titles(name), education(*), certifications(certificate_name, description)",
      )
      .eq("id", id);
    if (error) throw error;

    if (data.length < 1) throw new Error("no employees found");

    const [employee] = data;

    const name = `${employee.first_name} - ${employee.titles.name}`;

    const projects = employee.projects.map((item: any) => {
      const startDate = new Date(item.date_start).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const endDate = item.ongoing
        ? "Present"
        : new Date(item.date_end).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
      return [
        ["Project Name", item.name],
        ["Project Description", item.description],
        ["Field", item.field],
        ["Size of the team", item.team_size],
        ["Position", item.position],
        ["Tools & Technologies", item.technologies.join(", ")],
        ["Responsibilities", item.responsibilities.join(", ")],
        ["Time Period", `${startDate} - ${endDate}`],
        [{ content: "", colSpan: 2 }],
      ];
    });

    const education = employee.education.map(
      (item) =>
        `${item.university_name}\n${item.degree}\n${item.start_year} - ${item.end_year}`,
    );

    const certifications = employee.certifications.map(
      (item) => `${item.certificate_name} - ${item.description}`,
    );

    const skills: Record<string, Array<string>> = transformSkillsBySkillGroup(
      employee.cv_skill,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doc = new jsPDF();

    const width = doc.internal.pageSize.getWidth();

    const headerFontColor = [67, 67, 67];
    const cellBodyTextColor = [95, 95, 95];
    const backgroundColor = [240, 240, 240];
    const borderColor = [215, 215, 215];
    const borderWidth = 0.3;
    const cellPadding = 3;

    // 'global' table styles
    const tableStyles = {
      theme: "grid",
      tableLineColor: borderColor,
      tableLineWidth: borderWidth,
      styles: {
        lineColor: borderColor,
        lineWidth: borderWidth,
      },
      headStyles: {
        fillColor: backgroundColor,
        fontSize: 12,
        fontStyle: "normal",
        halign: "center",
        textColor: headerFontColor,
      },
      bodyStyles: {
        textColor: cellBodyTextColor,
        cellPadding,
      },
      columnStyles: { 0: { textColor: 95, fontStyle: "bold" } },
      pageBreak: "auto",
      margin: { left: 25, right: 25 },
    };

    doc.setTextColor(95, 95, 95);
    doc.setFont("helvetica", "bold");

    doc.text(`${name}`, width / 2, 32, {
      align: "center",
    });

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    autoTable(doc, {
      ...tableStyles,
      columnStyles: {},
      head: [["Summary of Qualification"]],
      body: [[employee.summary || ""]],
      margin: { ...tableStyles.margin, top: 40 },
    });

    const skillsBody: Array<[string, string[], string[]]> = [];

    Object.entries(skills).map(([groupName, skills]) => {
      const skillList1: Array<string> = [];
      const skillList2: Array<string> = [];

      // separate skills in two columns
      for (let i = 0; i < skills.length; i++) {
        if (i % 2 === 0) {
          skillList1.push(skills[i]);
        } else {
          skillList2.push(skills[i]);
        }
      }

      skillsBody.push([groupName, skillList1, skillList2]);
    });

    autoTable(doc, {
      ...tableStyles,
      columnStyles: {
        0: {
          minCellWidth: 35,
          textColor: 95,
          fontStyle: "bold",
          lineWidth: { right: 0.6, top: 0.3 },
        },
      },
      head: [
        [
          {
            content: "Technical Skills",
            colSpan: 3,
          },
        ],
      ],
      body: skillsBody,
      didParseCell: function (data) {
        // set space between skills after new line
        doc.setLineHeightFactor(1.5);
        if (Array.isArray(data.cell.raw)) {
          // remove border between two columns in skills body
          data.cell.styles.lineWidth = { top: 0.3 };
          data.cell.text = data.cell.raw.map(function (element) {
            return `- ${element}`;
          });
        }
      },
    });

    doc.setLineHeightFactor(1.15);

    autoTable(doc, {
      ...tableStyles,
      bodyStyles: {
        ...tableStyles.bodyStyles,
        lineWidth: 0,
      },
      columnStyles: {
        0: {
          lineWidth: { right: borderWidth },
          textColor: 95,
          fontStyle: "bold",
        },
      },
      head: [
        [
          {
            content: "Projects",
            colSpan: 2,
          },
        ],
      ],
      body: projects.flat().slice(0, -1),
      willDrawCell: function (data) {
        if (data.section === "body") {
          const rowIndex = data.row.index;
          if (
            rowIndex !== 0 &&
            rowIndex % 7 === 0 &&
            rowIndex !== projects.length * 7
          ) {
            // draw a horizontal line (border) between projects
            data.row.cells[0].styles.lineWidth = { right: 0.3, bottom: 0.3 };
            data.row.cells[1].styles.lineWidth = { right: 0.3, bottom: 0.3 };
          }
        }
      },
    });

    autoTable(doc, {
      ...tableStyles,
      head: [
        [
          {
            content: "Education",
            colSpan: 2,
          },
        ],
      ],
      body: [
        ["University degree", education.join("\n\n")],
        [
          "Level of English \nSpoken \nWritten",
          `\n${employee.english_spoken_level}\n${employee.english_written_level}`,
        ],
        ["Certifications", certifications.join("\n")],
      ],
    });

    autoTable(doc, {
      ...tableStyles,
      head: [
        [
          {
            content: "Additional Information",
            colSpan: 2,
          },
        ],
      ],
      body: [["Personal qualities", employee.personal_qualities]],
    });

    const result = doc.output("arraybuffer");

    const uploadName = `${employee.first_name} - ${employee.titles.name}`;

    await supabaseClient.storage.from("pdfs").upload(uploadName, result, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: true,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(error.stack, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import jsPDF from "https://esm.sh/jspdf@2.5.1?target=deno&no-check";
import autoTable from "https://esm.sh/jspdf-autotable@3.5.28?target=deno&no-check";
import { corsHeaders } from "../_shared/cors.ts";

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
        "*, projects(*), positions(title), education(*), certifications(certificate_name, description)",
      )
      .eq("id", id);
    if (error) throw error;

    if (data.length < 1) throw new Error("no employees found");

    const [employee] = data;

    const name = `${employee.first_name} - ${employee.positions.title}`;

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doc = new jsPDF();

    const width = doc.internal.pageSize.getWidth();

    const cellBodyTextColor = [95, 95, 95];
    const backgroundColor = [240, 240, 240];
    const borderColor = [215, 215, 215];
    const borderWidth = 0.3;
    const cellPadding = 3;

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
        textColor: 0,
      },
      bodyStyles: {
        textColor: cellBodyTextColor,
        cellPadding,
      },
      columnStyles: { 0: { textColor: 95, fontStyle: "bold" } },
      pageBreak: "avoid",
      margin: { left: 25, right: 25 },
    };

    doc.setTextColor(95, 95, 95);
    doc.setFont("times", "bold");

    doc.text(`${name}`, width / 2, 32, {
      align: "center",
    });

    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");

    autoTable(doc, {
      ...tableStyles,
      columnStyles: {},
      head: [["Summary of Qualification"]],
      body: [[employee.summary || ""]],
      margin: { ...tableStyles.margin, top: 40 },
    });

    autoTable(doc, {
      ...tableStyles,
      head: [
        [
          {
            content: "Technical Skills",
            colSpan: 2,
          },
        ],
      ],
      body: [
        ["Programming languages", employee.programming_languages],
        ["Libs & Frameworks", employee.libs_and_frameworks],
        ["Big Data", employee.big_data],
        ["Databases", employee.databases],
        ["Dev Ops", employee.devops],
      ],
    });

    autoTable(doc, {
      ...tableStyles,
      head: [
        [
          {
            content: "Projects",
            colSpan: 2,
          },
        ],
      ],
      body: projects.flat().slice(0, -1),
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

    const uploadName = `${employee.first_name} - ${employee.positions.title}`;

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

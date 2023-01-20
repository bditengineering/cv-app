// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import jsPDF from "https://esm.sh/jspdf@2.5.1?target=deno&no-check";
import autoTable from "https://esm.sh/jspdf-autotable@3.5.28?target=deno&no-check";

console.log("Hello from Functions!");

serve(async function handler(req: Request) {
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
      .select("*, projects(*)")
      .eq("id", id);
    if (error) throw error;

    if (data.length < 1) throw new Error("no employees found");

    const [employee] = data;
    const name = `${employee.first_name} ${employee.last_name}`;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doc = new jsPDF();

    const width = doc.internal.pageSize.getWidth();

    doc.text(`${name}`, width / 2, 10, { align: "center" });

    autoTable(doc, {
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 0.5,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [224, 224, 224],
        fontSize: 15,
        halign: "center",
        textColor: 0,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
        textColor: 0,
      },
      head: [["Summary of Qualification"]],
      body: [[employee.summary || ""]],
    });

    autoTable(doc, {
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 0.5,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [224, 224, 224],
        fontSize: 15,
        halign: "center",
        textColor: 0,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
        textColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
      },
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

    const projectsBody: any[] = [];

    employee.projects &&
      employee.projects.map((project: any) => {
        projectsBody.push(["Project name", project.name]);
        projectsBody.push(["Project description", project.description]);
        projectsBody.push(["Field", project.field]);
        projectsBody.push(["Size of the team", project.team_size]);
        projectsBody.push(["Position", project.position]);
        projectsBody.push(["Tools & Technologies", project.technologies]);
        projectsBody.push(["Responsibilities", project.responsibilities]);
        projectsBody.push([
          "Time Period",
          `${project.from_month} ${project.from_year} - ${project.until_month} ${project.until_year}`,
        ]);
      });

    autoTable(doc, {
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 0.5,
      styles: {
        lineColor: [192, 192, 192],
      },
      headStyles: {
        fillColor: [224, 224, 224],
        fontSize: 15,
        halign: "center",
        textColor: 0,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
        textColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
      },
      head: [
        [
          {
            content: "A Few Latest Projects",
            colSpan: 2,
          },
        ],
      ],
      body: projectsBody,
    });

    autoTable(doc, {
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 0.5,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [224, 224, 224],
        fontSize: 15,
        halign: "center",
        textColor: 0,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
        textColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
      },
      head: [
        [
          {
            content: "Education",
            colSpan: 2,
          },
        ],
      ],
      body: [
        [
          "University degree",
          `${employee.university}\n${employee.degree}\n${employee.university_start} - ${employee.university_end}`,
        ],
        [
          "Level of English \nSpoken \nWritten",
          `\n${employee.english_spoken}\n${employee.english_written}`,
        ],
        ["Certifications", employee.certifications],
      ],
    });

    autoTable(doc, {
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 0.5,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [224, 224, 224],
        fontSize: 15,
        halign: "center",
        textColor: 0,
      },
      bodyStyles: {
        fillColor: [250, 250, 250],
        textColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" },
      },
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

    const uploadName = `${employee.first_name}-${
      employee.last_name
    }-${new Date()}`;
    const { data: upload } = await supabaseClient.storage
      .from("pdfs")
      .upload(uploadName, result, {
        contentType: "application/pdf",
        // contentType: 'text/html',
        cacheControl: "3600",
        upsert: false,
      });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(error.stack, {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

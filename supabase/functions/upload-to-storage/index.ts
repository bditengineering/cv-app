// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import jsPDF from "https://esm.sh/jspdf@2.5.1?target=deno&no-check";
import autoTable from "https://esm.sh/jspdf-autotable@3.5.28?target=deno&no-check";
import { corsHeaders } from '../_shared/cors.ts'

serve(async function handler(req: Request) {

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
      .select("*, projects(*), positions(title), education(*), certifications(certificate_name, description)")
      .eq("id", id);
    if (error) throw error;

    if (data.length < 1) throw new Error("no employees found");

    const [employee] = data;

    const name = `${employee.first_name} - ${employee.positions.title}`;

    const projects = employee.projects.map((item: any) => {
      const startDate = new Date(item.date_start).toLocaleString('default', { month: 'long', year: 'numeric' });
      const endDate = item.ongoing ? "Present" : new Date(item.date_end).toLocaleString('default', { month: 'long', year: 'numeric' })
      return [
        ["Project Name", item.name],
        ["Project Description", item.description],
        ["Field", item.field],
        ["Size of the team", item.team_size],
        ["Position", item.position],
        ["Tools & Technologies", item.technologies.join(", ")],
        ["Responsibilities", item.responsibilities.join(", ")],
        ["Time Period", `${startDate} - ${endDate}`],
        [{ content: '', colSpan: 2 }],
      ]
    });

    const education = employee.education.map(item => `${item.university_name}\n${item.degree}\n${item.start_year} - ${item.end_year}`);

    const certifications = employee.certifications.map(item => `${item.certificate_name} - ${item.description}`);
    const options = { format: "A4" };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doc = new jsPDF();

    doc.text(`${name}`, 10, 10);

    autoTable(doc, {
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 1,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 1,
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
      tableLineWidth: 1,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 1,
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
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 1,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 1,
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
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 1,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 1,
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
      theme: "grid",
      tableLineColor: [192, 192, 192],
      tableLineWidth: 1,
      styles: {
        lineColor: [192, 192, 192],
        lineWidth: 1,
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

    const { data: upload } = await supabaseClient.storage
      .from("pdfs")
      .upload(uploadName, result, {
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

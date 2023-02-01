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
      .select("*")
      .eq("id", id);
    if (error) throw error;

    if (data.length < 1) throw new Error("no employees found");

    const [employee] = data;
    const name = `${employee.first_name} ${employee.last_name}`;

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
    // const result = 'test!!';

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

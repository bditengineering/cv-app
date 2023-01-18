// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import jsPDF from "https://esm.sh/jspdf@2.5.1?target=deno&no-check";

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

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <div style="padding: 15; border: 1px solid black;">
            <span style="color: red; display: inline;">Name: ${employee.first_name}</span>
            <span style="color: blue;">Last name: ${employee.last_name}</span>
          </div>
        </body>
      </html>`;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const doc = new jsPDF();

    doc.html(html, {
      async callback(doc) {
        doc.output("arraybuffer");
      },
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

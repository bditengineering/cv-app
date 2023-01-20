import { NextApiRequest, NextApiResponse } from "next";
import { auth, auth as GoogleAuth, JWT } from "google-auth-library";
import { google } from "googleapis";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

const { CREDS } = process.env;

/**
 * Upload a file to the specified folder
 * @param{string} folderId folder ID
 * @return{obj} file Id
 * */
async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
) {
  // load the environment variable with our keys
  const keysEnvVar = CREDS;
  if (!keysEnvVar) {
    throw new Error("The $CREDS environment variable was not found!");
  }
  const keys = JSON.parse(keysEnvVar);
  keys.scopes = ["https://www.googleapis.com/auth/drive"];
  const client = GoogleAuth.fromJSON(keys);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  client.scopes = ["https://www.googleapis.com/auth/drive"];
  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  const res1 = await client.request({ url });
  const service = google.drive({ version: "v3", auth });

  const folderId = "1Ysxsvp0ZFI-2nIPCy9acxwHqMQVE-Nfe";
  const fileMetadata = {
    name,
    parents: [folderId],
  };

  // Create a Supabase client with the Auth context of the logged in user.
  const supabase = createServerSupabaseClient({ req, res });

  const { data, error } = await supabase.storage.from("pdfs").download(name);
  const media = {
    mimeType: "application/pdf",
    body: data,
  };

  const file = await service.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });
  console.log("File Id:", file.data.id);
  return file.data.id;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await uploadFile(req, res, "name11_lastname11");
  res.status(200).json({ name: "John Doe" });
}

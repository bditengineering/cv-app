import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import { google } from "googleapis";
import { supabase } from "../../utils/supabase";

/**
 * Upload a file to the specified folder
 * @param{string} filneName folder ID
 * */
async function uploadFile(
  fileName: string,
) {

  const gdriveSettings = process.env.GOOGLE_DRIVE_SETTINGS || ""
  const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || ""
  const driveCredentials = JSON.parse(gdriveSettings)
  const scopes = ["https://www.googleapis.com/auth/drive"];
  const { data, error } = await supabase.storage.from("pdfs").download(fileName);

  if (error || data === null) {
    console.error(error);
    return;
  }

  if (data === null) {
    console.error("No data received from Supabase.")
    return
  }

  const stream = await createStream(data)

  const auth = new google.auth.GoogleAuth({
    credentials: driveCredentials,
    scopes: scopes
  });

  const driveService = google.drive({ version: 'v3', auth })
  const fileMetadata = {
    'name': fileName,
    'parents': [driveFolderId]
  }
  const media = {
    mimeType: "application/pdf",
    body: stream,
  }

  await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id'
  })

}

async function createStream(data: Blob) {
  const buffer = Buffer.from(await data!.arrayBuffer());
  const stream = new Readable();
  stream._read = () => { }; // _read is required but we can noop it
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const fileName = req.query.file_name as string
  await uploadFile(fileName);
}

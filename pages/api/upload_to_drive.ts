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

  if (error) throw error;

  if (!data) throw new Error("No data received from Supabase.");

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

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id'
  })
  return response
}

async function createStream(data: Blob) {
  const buffer = Buffer.from(await data.arrayBuffer());
  const stream = new Readable();

  // eslint-disable-next-line  @typescript-eslint/no-empty-function
  stream._read = () => { }; // _read is required but we can noop it
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const fileName = req.query.file_name as string
    await uploadFile(fileName);
    res.status(200).end();
  } catch (error) {
    res.status(405).end()
  }
}

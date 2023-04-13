import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import { google } from "googleapis";
import { supabase } from "../../utils/supabase";

/**
 * Upload a file to the specified folder
 * @param{string} filneName folder ID
 * */
async function uploadFile(
  fileName: string,
  folderName: string,
) {

  const gdriveSettings = process.env.GOOGLE_DRIVE_SETTINGS || "";
  const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
  const driveCredentials = JSON.parse(gdriveSettings);
  const scopes = ["https://www.googleapis.com/auth/drive"];
  const { data, error } = await supabase.storage.from("pdfs").download(fileName);

  if (error) throw error;

  if (!data) throw new Error("No data received from Supabase.");

  const stream = await createStream(data);

  const auth = new google.auth.GoogleAuth({
    credentials: driveCredentials,
    scopes: scopes
  });

  async function resolveParentFolderId(folderName: string): Promise<string | undefined | null> {
    // Check if the folder already exists
    const folderListResponse = await driveService.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`,
      fields: "nextPageToken, files(id, name)",
      spaces: "drive",
    });

    const folderId = folderListResponse.data.files?.[0]?.id;
    if (folderId) {
      return folderId;
    }

    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [driveFolderId],
    };

    const folderResponse = await driveService.files.create({
      requestBody: folderMetadata
    });
    return folderResponse.data.id;
  };

  async function resolveFileNameForDrive(initialFileName: string): Promise<string> {
    let currentFileName = initialFileName;
    let finished = false;
    let i = 0;
    while (!finished) {
      const filesListResponse = await driveService.files.list({
        q: `trashed=false and name='${currentFileName}'`,
        fields: "nextPageToken, files(id, name)",
        spaces: "drive",
      });

      if (filesListResponse.data.files && filesListResponse.data.files.length > 0) {
        const endIndex = currentFileName.indexOf('_') != -1 ? currentFileName.indexOf('_') : currentFileName.length
        currentFileName = currentFileName.substring(0, endIndex) + '_' + ++i;
      } else {
        finished = true;
      }
    }

    return currentFileName;

  };

  const parentFolderId = await resolveParentFolderId(folderName);

  const driveService = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    'name': fileName,
    'parents': [parentFolderId]
  };
  const media = {
    mimeType: "application/pdf",
    body: stream,
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id'
  });
  return response;
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
    const parsedBody = JSON.parse(req.body);
    const fileName = parsedBody.fileName;
    const folderName = parsedBody.folderName;
    await uploadFile(fileName, folderName);
    res.status(200).end();
  } catch (error) {
    res.status(405).end()
  }
}

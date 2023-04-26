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
  const driveService = google.drive({ version: 'v3', auth });

  async function resolveParentFolderId(folderName: string): Promise<string> {
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

    if (folderResponse.data.id) {
      return folderResponse.data.id;
    }
    return "";
  };

  async function resolveFileNameForDrive(initialFileName: string): Promise<string> {
    let currentFileName = initialFileName;
    let uniqueFileNameGenerated = false;
    let i = 0;
    // Underscore followed by at least one number
    const regex = /_([0-9]+)$/;
    // Below code generates unique file name, adding _1,_2,... until it finds the version that does not exist
    while (!uniqueFileNameGenerated) {
      const filesListResponse = await driveService.files.list({
        q: `trashed=false and name='${currentFileName}'`,
        fields: "nextPageToken, files(id, name)",
        spaces: "drive",
      });

      if (filesListResponse.data.files && filesListResponse.data.files.length > 0) {
        // Check if filename has _1, _2,... and if it has, increment the number at the end
        if (currentFileName.match(regex)) {
          currentFileName = currentFileName.replace(regex, (_, number) => `_${parseInt(number) + 1}`);
        } else {
          currentFileName += "_1"
        }
      } else {
        uniqueFileNameGenerated = true;
      }
    }
    return currentFileName;
  };

  const parentFolderId = await resolveParentFolderId(folderName);
  const driveFileName = await resolveFileNameForDrive(fileName);

  const fileMetadata = {
    'name': driveFileName,
    'parents': [parentFolderId],
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
    res.status(405).send(error);
  }
}

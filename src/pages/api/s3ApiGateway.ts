import type { NextApiRequest, NextApiResponse } from 'next';
import formidable,{ Fields, Files } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';


export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFileToApiGateway = async (file: any, filename: string): Promise<void> => {
  const url = `https://65utciwfek.execute-api.ap-south-1.amazonaws.com/dev/thetre/${filename}`;

  const form = new FormData();
  form.append('file', fs.createReadStream(file.filepath), file.originalFilename?.toString());

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.mimetype!,
      'x-api-key': process.env.AWS_API_GATEWAY_KEY!,
    },
    body: fs.createReadStream(file.filepath),
  });
  console.log(response)

  console.log('File uploaded successfully to S3');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = formidable({});

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }

      const file = (files.file as formidable.File[])[0] as formidable.File;
      const filename = (fields.filename as string[])[0] as string;

    if (!filename) {
      res.status(400).json({ error: 'Filename is required' });
      return;
    }

    try {
      await uploadFileToApiGateway(file, filename);
      console.log("hee")
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error uploading file' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;

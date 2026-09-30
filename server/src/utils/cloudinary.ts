import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadMedia(file: Express.Multer.File, folder = 'linkedin'): Promise<string> {
  if (isCloudinaryConfigured) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      return result.secure_url;
    } catch (err) {
      console.warn('[Upload] Cloudinary upload failed, falling back to local storage:', err);
    }
  }

  // Local fallback: write buffer to server/uploads/
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(file.originalname) || '.jpg';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return `${serverUrl}/uploads/${fileName}`;
}

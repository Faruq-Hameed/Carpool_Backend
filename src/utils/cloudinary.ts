import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { type Files } from 'formidable';
import { config } from '@/config/dev';

dotenv.config();

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

interface ImageInfo {
  url: string;
  publicId: string;
}

const uploadImages = async (
  files: Files<string>,
  validFileList: string[],
): Promise<ImageInfo[]> => {
  const storeImages: ImageInfo[] = [];
  const fileList = Object.keys(files);
  if (fileList.length) {
    await Promise.all(
      validFileList.map(async item => {
        const fileItem = files[item];
        if (fileItem !== undefined) {
          const image = await cloudinary.uploader.upload(fileItem[0].filepath, {
            resource_type: 'image',
            public_id: '',
            overwrite: true,
            notification_url: 'https://myecurrencyng.com/notify_cloudinary',
          });
          const { url, publicId = image.public_id } = image;
          storeImages.push({ url, publicId });
        } /* else {
          storeImages.push({ url: '', public_id: '' });
        } */
      }),
    );
  }
  return storeImages;
};

export default uploadImages;

// s3Config.ts
// import multer from 'multer';
// import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import { BadRequestError } from './errors'; // Load environment variables from .env file

// Initialize the AWS S3 client
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Make sure to handle undefined
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   region: process.env.AWS_REGION!,
// });

// Define upload configuration
// export const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME!,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, `${Date.now().toString()}_${file.originalname}`); // File key in the S3 bucket
//     }
//   }),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
//     files: 4, // Maximum 4 files allowed
//   }
// });

import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import multer from 'multer';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

// Define the upload configuration
export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME ?? '',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
      throw new BadRequestError('Only image files are allowed!');
      // return cb(null, false); //CHECK IF THIS WORK
    }
    cb(null, true);
  },
});

// Set up multer to use S3 for storage
// export const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.S3_BUCKET_NAME!,
//     acl: 'public-read', // Allows the files to be publicly accessible
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       const uniqueName = `car-pictures/${Date.now().toString()}-${file.originalname}`;
//       cb(null, uniqueName);
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
//   fileFilter: function (req, file, cb) {
//     // Accept images only
//     if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
//         new BadRequestError('Only image files are allowed!')
//       return cb(null, false);
//     }
//     cb(null, true);
//   },
// });

export enum Status {
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export interface MulterS3File extends Express.Multer.File {
  location: string; // The URL of the file stored in S3
}

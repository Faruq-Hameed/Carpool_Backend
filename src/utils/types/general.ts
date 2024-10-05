export enum Status {
  ACTIVE = 'active',
  RESTRICTED = 'restricted',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export interface MulterS3File extends Express.Multer.File {
  location: string; // The URL of the file stored in S3
}

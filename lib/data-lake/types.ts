export interface FileMetadata {
  id: string;
  filename: string;
  blobKey: string;
  blobUrl: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export interface MpcFileRecord {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  size: number;
}

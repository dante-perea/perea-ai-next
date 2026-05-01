export interface FileMetadata {
  id: string;
  filename: string;
  blobKey: string;
  blobUrl: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export interface MpcFileRecord {
  id: string;
  filename: string;
  url: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

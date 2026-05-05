export type KnowledgeType = 'knowledge_graph' | 'session' | 'idea_list' | 'document';

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
  userId: string;
  teamId: string | null;
  knowledgeType: KnowledgeType;
}

export interface KbFileRecord {
  id: string;
  filename: string;
  url: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

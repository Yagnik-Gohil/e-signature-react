export interface IProfile {
  id: string;
  created_at: string;
  name: string;
  email: string;
  status: string;
}
export interface IAsset {
  id: string;
  created_at: string;
  base_url: string;
  root: string;
  folder: string;
  name: string;
  status: string;
}
export enum SignatureStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SIGNED = 'signed',
}


export enum UserDocumentType {
  OWNER = 'owner',
  SIGNER = 'signer',
}

export interface IDocuments {
  id: string
  title: string
  base_url: string
  root: string
  folder: string
  name: string
  status: string
  user_documents: {
    id: string
    status: string
    role: string
    type: UserDocumentType
    sequence: number
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}
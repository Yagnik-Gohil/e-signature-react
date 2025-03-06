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
  DRAFT = "draft",
  PENDING = "pending",
  SIGNED = "signed",
}

export enum UserDocumentType {
  OWNER = "owner",
  SIGNER = "signer",
}

export interface IDocuments {
  id: string;
  title: string;
  base_url: string;
  root: string;
  folder: string;
  name: string;
  status: string;
  user_document: {
    id: string;
    status: string;
    role: string;
    type: UserDocumentType;
    signature_box: ISignatureBox;
    sequence: number;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

export interface IContacts {
  id: string;
  recipient: {
    id: string;
    email: string;
  };
  recipient_name: string;
}
export interface ISignatureBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface IAddSignatureBox {
  user_document: {
    id: string
    signature_box: ISignatureBox
  }[]
}



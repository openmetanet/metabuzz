export interface MetaIdDataTypes {
  metanetId: string;
  rootTxId: string;
  txId: string;
  address?: string;
  publicKey: string;
  parentTxTd: string;
  metaId: string;
  nodeName: string;
  data: ObjTypes<any>;
  encrypt: string;
  version: string;
  dataType: string;
  encoding: string;
  blockHeight?: number;
  timestamp: number;
  isValid: boolean;
  isNew: boolean;
  fee: number;
  parts: string[];
  vouts: MetaTxOutTypes[];
}
interface MetaTxOutTypes {
  txId: string;
  index: number;
  address: string;
  value: number;
  scriptPubKey: string;
  type: string;
}
export interface UserInfoTypes {
  metaIdTag: string;
  metaId: string;
  protocolTxId: string;
  infoTxId: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  avatarTxId: string;
  update?: number;
  [key: string]: any;
}

export type Maybe<T> = T | null;

export enum ScriptpubkeyType {
  OpReturn = 'op_return',
  P2wpkh = 'v0_p2wpkh',
}

export type BitcoinInput = {
  __typename?: 'BitcoinInput';
  txid: string;
  vout: number;
  isCoinbase: boolean;
  scriptsig_asm: string;
  prevout: {
    txid: string;
    vout: number;
    value?: number;
    address?: string;
  };
};

export type BitcoinOutputStatus = {
  __typename?: 'BitcoinOutputStatus';
  spent: boolean;
  txid?: string | null;
  vin?: number | null;
};

export type BitcoinOutput = {
  __typename?: 'BitcoinOutput';
  address?: string;
  value: number;
  scriptpubkey_address?: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  spent: {
    txid: string;
    vin: number;
    status: {
      confirmed: boolean;
      block_hash: string;
      block_height: number;
      block_time: number;
    };
  } | null;
};

export type BitcoinTransaction = {
  __typename?: 'BitcoinTransaction';
  txid: string;
  blockHeight?: number;
  blockHash?: string;
  size: number;
  fee: number;
  confirmed: boolean;
  vin: BitcoinInput[];
  vout: BitcoinOutput[];
};

export type CkbCell = {
  __typename?: 'CkbCell';
  id: string;
  from_cellbase: boolean;
  capacity: string;
  occupied_capacity: string;
  address_hash: string;
  generated_tx_hash: string;
  cell_index: string;
  cell_type: string;
  since: {
    raw: string;
    median_timestamp: string;
  };
  tags: string[];
  udt_info?: {
    symbol: string;
    amount: string;
    decimal: string;
    type_hash: string;
    published: boolean;
  };
  extra_info?: {
    symbol: string;
    amount: string;
    decimal: string;
    type_hash: string;
    published: boolean;
  };
  rgb_info?: {
    txid: string;
    index: string;
    address: string;
    status: string;
    consumed_txid: string;
  };
  assetId?: string;
  icon?: string;
  symbol?: string;
  decimal?: string;
  amount?: string;
  value?: string;
};

export type CkbCellStatus = {
  __typename?: 'CkbCellStatus';
  consumed: boolean;
  index?: number | null;
  txHash?: string | null;
};

export type CkbXudtInfo = {
  __typename?: 'CkbXUDTInfo';
  amount: string;
  decimal: number;
  symbol: string;
  typeHash: string;
};

export type CkbScript = {
  __typename?: 'CkbScript';
  args: string;
  codeHash: string;
  hashType: string;
};

export type CkbAddressBalance = {
  __typename?: 'CkbAddressBalance';
  available: string;
  occupied: string;
  total: string;
};

export type CkbAddress = {
  __typename?: 'CkbAddress';
  address: string;
  balance?: CkbAddressBalance;
  shannon?: number;
  transactions?: CkbTransaction[];
  transactionsCount?: number;
};

export type CkbBlock = {
  __typename?: 'CkbBlock';
  confirmations: number;
  hash: string;
  miner?: CkbAddress;
  number: number;
  reward?: number;
  size: number;
  timestamp: number;
  totalFee?: number;
  transactions?: CkbTransaction[];
  transactionsCount: number;
  version: number;
};

export type CkbTransaction = {
  outputs: any;
  __typename?: 'CkbTransaction';
  block?: CkbBlock;
  block_number: number;
  block_timestamp?: number;
  bytes: number;
  confirmations: number;
  display_inputs: CkbCell[];
  display_outputs: CkbCell[];
  fee?: number;
  fee_rate?: number;
  hash: string;
  is_cellbase: boolean;
  size: number;
  transaction_hash: string;
  tx_status: {
    status: string;
  };
};

export type RgbppTransaction = {
  __typename?: 'RgbppTransaction';
  txHash: string;
  network: 'btc' | 'ckb';
  timestamp: number;
  btc: {
    txid: string | null;
  };
  ckbTransaction: {
    outputs: Array<{
      txHash: string;
      index: number;
      capacity: string;
      lock: {
        codeHash: string;
        hashType: string;
        args: string;
      };
      cellType: string;
      xudtInfo: {
        symbol: string | null;
        amount: string;
        decimal: number | null;
      } | null;
    }>;
  };
  direction?: 'on' | 'off' | 'within';
};

export enum CellType {
  Dob = 'DOB',
  Mnft = 'MNFT',
  Sudt = 'SUDT',
  Xudt = 'XUDT'
}

export enum LeapDirection {
  BtcToCkb = 'BtcToCkb',
  CkbToBtc = 'CkbToBtc',
}

export type BitcoinAddress = {
  __typename?: 'BitcoinAddress';
  address: string;
};

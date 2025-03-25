export type DocumentSettingsDTO = {
  storeAddress: Record<string, any> | null;
  storeLogoSource: string | null;
};

export type DocumentInvoiceSettingsDTO = {
  forcedNumber: number | null;
  numberFormat: string | null;
  template: string | null;
};

export type DocumentPackingSlipSettingsDTO = {
  forcedNumber: number | null;
  numberFormat: string | null;
  template: string | null;
};

export type DocumentInvoiceDTO = {
  number: number;
  displayNumber: string;
  created_at: Date;
};

export type DocumentPackingSlipDTO = {
  number: number;
  displayNumber: string;
  created_at: Date;
};

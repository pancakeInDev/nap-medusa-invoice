import { BaseAddress } from "@medusajs/framework/types";
import { InvoiceTemplateKind, PackingSlipTemplateKind } from "./template-kind";
import { Invoice } from "./invoice";
import { PackingSlip } from "./packing-slip";

export type DocumentAddress = Omit<
  BaseAddress,
  "metadata" | "created_at" | "updated_at" | "customer_id"
>;

export type DocumentSettings = {
  id: string;
  store_address: DocumentAddress;
  store_logo_source: string;
  invoice_number_format: string;
  invoice_template: InvoiceTemplateKind;
};

export type DocumentInvoiceSettings = {
  id: string;
  numberFormat?: string;
  template?: InvoiceTemplateKind;
  forcedNumber?: string;
};

export type AdminStoreDocumentSettingsQueryReq = {};

export type StoreDocumentSettingsResult = {
  settings?: DocumentSettings;
};

export type AdminStoreDocumentInvoiceSettingsPostReq = {
  formatNumber?: string;
  forcedNumber?: number;
  template?: string;
};

export type AdminStoreDocumentInvoiceSettingsQueryReq = {};

export type StoreDocumentInvoiceSettingsResult = {
  settings?: DocumentInvoiceSettings;
};

export type AdminStoreDocumentAddressPostReq = {
  address: DocumentAddress;
};

export type InvoiceResult = {
  invoice?: Invoice;
  buffer?: Buffer;
};

export type AdminStoreDocumentPackingSlipSettingsQueryReq = {};

export type DocumentPackingSlipSettings = {
  id: string;
  number_format?: string;
  forced_number?: string;
  template?: PackingSlipTemplateKind;
};

export type StoreDocumentPackingSlipSettingsResult = {
  settings?: DocumentPackingSlipSettings;
};

export type PackingSlipResult = {
  packingSlip?: PackingSlip;
  buffer?: Buffer;
};

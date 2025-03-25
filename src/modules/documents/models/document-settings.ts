import { model } from "@medusajs/framework/utils";
import DocumentInvoice from "./document-invoice";
import DocumentPackingSlip from "./document-packing-slip";

const DocumentSettings = model.define("document_settings", {
  id: model.id().primaryKey(),
  storeAddress: model.json().nullable(),
  storeLogoSource: model.text().nullable(),
  documentInvoice: model.hasMany(() => DocumentInvoice, {
    mappedBy: "settings",
  }),
  documentPackingSlip: model.hasMany(() => DocumentPackingSlip, {
    mappedBy: "settings",
  }),
});

export default DocumentSettings;

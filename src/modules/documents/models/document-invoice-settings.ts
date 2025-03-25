import { model } from "@medusajs/framework/utils";
import DocumentInvoice from "./document-invoice";

const DocumentInvoiceSettings = model.define("document_invoice_settings", {
  id: model.id().primaryKey(),
  forcedNumber: model.number().nullable(),
  numberFormat: model.text().nullable(),
  template: model.text().nullable(),
  documentInvoice: model.hasMany(() => DocumentInvoice, {
    mappedBy: "invoiceSettings",
  }),
});

export default DocumentInvoiceSettings;

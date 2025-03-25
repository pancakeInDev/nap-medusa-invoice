import { model } from "@medusajs/framework/utils";
import DocumentInvoiceSettings from "./document-invoice-settings";
import DocumentSettings from "./document-settings";

const DocumentInvoice = model.define("document_invoice", {
  id: model.id().primaryKey(),
  number: model.number(),
  displayNumber: model.text(),
  invoiceSettings: model.belongsTo(() => DocumentInvoiceSettings, {
    mappedBy: "documentInvoice",
  }),
  settings: model.belongsTo(() => DocumentSettings, {
    mappedBy: "documentInvoice",
  }),
});

export default DocumentInvoice;

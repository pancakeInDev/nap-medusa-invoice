import { model } from "@medusajs/framework/utils";
import DocumentPackingSlipSettings from "./document-packing-slip-settings";
import DocumentSettings from "./document-settings";

const DocumentPackingSlip = model.define("document_packing_slip", {
  id: model.id().primaryKey(),
  number: model.number(),
  displayNumber: model.text(),
  packingSlipSettings: model.belongsTo(() => DocumentPackingSlipSettings, {
    mappedBy: "documentPackingSlip",
  }),
  settings: model.belongsTo(() => DocumentSettings, {
    mappedBy: "documentPackingSlip",
  }),
});

export default DocumentPackingSlip;

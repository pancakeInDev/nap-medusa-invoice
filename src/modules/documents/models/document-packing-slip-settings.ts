import { model } from "@medusajs/framework/utils";
import DocumentPackingSlip from "./document-packing-slip";

const DocumentPackingSlipSettings = model.define(
  "document_packing_slip_settings",
  {
    id: model.id().primaryKey(),
    forcedNumber: model.number().nullable(),
    numberFormat: model.text().nullable(),
    template: model.text().nullable(),
    documentPackingSlip: model.hasMany(() => DocumentPackingSlip, {
      mappedBy: "packingSlipSettings",
    }),
  }
);

export default DocumentPackingSlipSettings;

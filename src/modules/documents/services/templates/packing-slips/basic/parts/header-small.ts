import { DocumentSettingsDTO } from "../../../../../types/dto";
import { t } from "i18next";

export function generateHeader(
  doc,
  y: number,
  documentSettings: DocumentSettingsDTO
): number {
  doc.fillColor("#444444").fontSize(12);

  doc.text(t("packing-slip", "Packing Slip"), 25, y, { align: "left" });

  const heightCompany = doc.heightOfString(
    documentSettings.storeAddress?.company,
    { align: "left" }
  );
  doc
    .fontSize(6)
    .text(documentSettings.storeAddress?.company, 25, y + 25, { align: "left" })
    .text(
      `${documentSettings.storeAddress?.city} ${documentSettings.storeAddress?.postal_code}`,
      25,
      y + 35,
      { align: "left" }
    );

  const heightAddress = doc.heightOfString(
    documentSettings.storeAddress?.address_1,
    { width: 150 }
  );

  doc.text(`${documentSettings.storeAddress?.address_1}`, 25, y + 45, {
    align: "left",
  });

  if (heightCompany > heightAddress + 45) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 45;
  }
}

import { DocumentSettingsDTO } from "../../../../../types/dto";
import { t } from "i18next";

export function generateHeader(
  doc,
  y: number,
  documentSettings: DocumentSettingsDTO
): number {
  doc.fillColor("#444444").fontSize(20);

  doc.text(t("packing-slip", "Packing Slip"), 50, y, { align: "left" });

  const heightCompany = doc.heightOfString(
    documentSettings.storeAddress?.company,
    { align: "left" }
  );
  doc
    .fontSize(10)
    .text(documentSettings.storeAddress?.company, 50, y + 30, { align: "left" })
    .text(
      `${documentSettings.storeAddress?.city} ${documentSettings.storeAddress?.postal_code}`,
      50,
      y + 45,
      { align: "left" }
    );

  const heightAddress = doc.heightOfString(
    documentSettings.storeAddress?.address_1,
    { width: 150 }
  );

  doc.text(`${documentSettings.storeAddress?.address_1}`, 50, y + 60, {
    align: "left",
  });

  if (heightCompany > heightAddress + 60) {
    return heightCompany + y;
  } else {
    return heightAddress + y + 60;
  }
}

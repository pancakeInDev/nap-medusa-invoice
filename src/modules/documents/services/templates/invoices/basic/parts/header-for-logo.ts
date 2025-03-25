import { DocumentSettingsDTO } from "../../../../../types/dto";

export function generateHeaderForLogo(
  doc,
  y: number,
  documentSettings: DocumentSettingsDTO
): number {
  doc.fillColor("#444444").fontSize(20);

  const heightCompany = doc.heightOfString(
    documentSettings.storeAddress?.company,
    { width: 250 }
  );

  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(documentSettings.storeAddress?.company, 50, 50, {
      align: "left",
      width: 250,
    })
    .moveDown()
    .fontSize(10)
    .text(documentSettings.storeAddress?.company, 50, heightCompany + 65, {
      align: "left",
    })
    .text(
      `${documentSettings.storeAddress?.city} ${documentSettings.storeAddress?.postal_code}`,
      50,
      heightCompany + 80,
      { align: "left" }
    );
  const heightOfAddress = doc.heightOfString(
    documentSettings.storeAddress?.address_1,
    { width: 250 }
  );
  doc.text(documentSettings.storeAddress?.address_1, 50, heightCompany + 95, {
    align: "left",
    width: 250,
  });

  return heightOfAddress + heightCompany + 95;
}

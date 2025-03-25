import PDFDocument from "pdfkit";
import { OrderDTO } from "@medusajs/framework/types";
import { generateHeader } from "./parts/header";
import { generateCustomerInformation } from "./parts/customer-info";
import { generateInvoiceTable } from "./parts/table";
import { generateInvoiceInformation } from "./parts/invoice-info";
import path from "path";
import { DocumentInvoiceDTO, DocumentSettingsDTO } from "../../../../types/dto";

export function validateInput(
  settings?: DocumentSettingsDTO
): [boolean, string] {
  if (
    settings &&
    settings.storeAddress &&
    settings.storeAddress.company &&
    settings.storeAddress.address_1 &&
    settings.storeAddress.city &&
    settings.storeAddress.postal_code
  )
    return [true, ""];
  return [
    false,
    `Not all settings are defined to generate template. Following settings are checked: company, address, city, postal_code`,
  ];
}

export default async (
  settings: DocumentSettingsDTO,
  invoice: DocumentInvoiceDTO,
  order: OrderDTO
): Promise<Buffer> => {
  var doc = new PDFDocument();
  doc.registerFont(
    "Regular",
    path.resolve(__dirname, "../../../../assets/fonts/IBMPlexSans-Regular.ttf")
  );
  doc.registerFont(
    "Bold",
    path.resolve(__dirname, "../../../../assets/fonts/IBMPlexSans-Bold.ttf")
  );
  doc.font("Regular");

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  const endHeader = generateHeader(doc, 50, settings);
  const endInvoiceInfo = generateInvoiceInformation(doc, endHeader, invoice);
  const endY = generateCustomerInformation(doc, endInvoiceInfo, order);
  generateInvoiceTable(doc, endY, order, order.items || []);

  doc.end();

  const bufferPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });

  return await bufferPromise;
};

import { DocumentInvoiceDTO } from "../../../../../../../modules/documents/types/dto";
import { generateHr } from "./hr";
import { t } from "i18next";

export function generateInvoiceInformation(
  doc,
  y: number,
  invoice: DocumentInvoiceDTO
): number {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(t("invoice", "Invoice"), 50, y + 40);

  generateHr(doc, y + 65);

  const invoiceInformationTop = y + 80;

  doc
    .fontSize(10)
    .text(
      `${t("invoice-number", "Invoice number")}:`,
      50,
      invoiceInformationTop
    )
    .font("Bold")
    .text(invoice.displayNumber, 150, invoiceInformationTop)
    .font("Regular")
    .text(
      `${t("invoice-date", "Invoice date")}:`,
      50,
      invoiceInformationTop + 15
    )
    .text(
      invoice.created_at.toLocaleDateString(),
      150,
      invoiceInformationTop + 15
    )
    .moveDown();

  return invoiceInformationTop + 15;
}

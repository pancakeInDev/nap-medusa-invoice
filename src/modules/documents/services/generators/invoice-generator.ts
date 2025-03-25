import { OrderDTO } from "@medusajs/framework/types";
import { DocumentInvoiceDTO, DocumentSettingsDTO } from "../../types/dto";
import { InvoiceTemplateKind } from "../../types/template-kind";
import basicTemplate, {
  validateInput as validateInputBasic,
} from "../templates/invoices/basic/basic";
import basicLogoTemplate, {
  validateInput as validateInputBasicLogo,
} from "../templates/invoices/basic/basic-logo";

export function validateInputForProvidedKind(
  templateKind: InvoiceTemplateKind,
  documentSettings: any
): [boolean, string] {
  switch (templateKind) {
    case InvoiceTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    case InvoiceTemplateKind.BASIC_LOGO:
      return validateInputBasicLogo(documentSettings);
    default:
      return [false, "Not supported template"];
  }
}

export function generateInvoice(
  kind: InvoiceTemplateKind,
  documentSettings: DocumentSettingsDTO,
  invoice: DocumentInvoiceDTO,
  order: OrderDTO
): Promise<Buffer> | undefined {
  switch (kind) {
    case InvoiceTemplateKind.BASIC:
      return basicTemplate(documentSettings, invoice, order);
    case InvoiceTemplateKind.BASIC_LOGO:
      return basicLogoTemplate(documentSettings, invoice, order);
    default:
      return Promise.resolve(Buffer.from("Not supported template"));
  }
}

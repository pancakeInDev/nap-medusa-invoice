import { OrderDTO } from "@medusajs/framework/types";
import { DocumentPackingSlipDTO, DocumentSettingsDTO } from "../../types/dto";
import { PackingSlipTemplateKind } from "../../types/template-kind";
import basicTemplate, {
  validateInput as validateInputBasic,
} from "../templates/packing-slips/basic/basic";
import smallTemplate, {
  validateInput as validateInputSmall,
} from "../templates/packing-slips/basic/small";

export function validateInputForProvidedKind(
  templateKind: PackingSlipTemplateKind,
  documentSettings: DocumentSettingsDTO
): [boolean, string] {
  switch (templateKind) {
    case PackingSlipTemplateKind.BASIC:
      return validateInputBasic(documentSettings);
    case PackingSlipTemplateKind.BASIC_SMALL:
      return validateInputSmall(documentSettings);
    default:
      return [false, "Not supported template"];
  }
}

export function generatePackingSlip(
  kind: PackingSlipTemplateKind,
  documentSettings: DocumentSettingsDTO,
  invoice: DocumentPackingSlipDTO,
  order: OrderDTO
): Promise<Buffer> | undefined {
  switch (kind) {
    case PackingSlipTemplateKind.BASIC:
      return basicTemplate(documentSettings, invoice, order);
    case PackingSlipTemplateKind.BASIC_SMALL:
      return smallTemplate(documentSettings, invoice, order);
    default:
      return Promise.resolve(Buffer.from("Not supported template"));
  }
}

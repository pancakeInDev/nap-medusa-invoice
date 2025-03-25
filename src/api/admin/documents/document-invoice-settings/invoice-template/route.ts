import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { DOCUMENTS_MODULE } from "../../../../../modules/documents";
import DocumentsModuleService from "../../../../../modules/documents/service";
import { InvoiceTemplateKind } from "../../../../../modules/documents/types/template-kind";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body: any = req.body as any;
  const invoiceTemplate: string | undefined = body.template;
  const documentsModuleService: DocumentsModuleService =
    req.scope.resolve(DOCUMENTS_MODULE);

  try {
    const newSettings = await documentsModuleService.updateInvoiceTemplate(
      invoiceTemplate as InvoiceTemplateKind
    );
    if (newSettings !== undefined) {
      res.status(201).json({
        settings: newSettings,
      });
    } else {
      res.status(400).json({
        message: "Cant update invoice template",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

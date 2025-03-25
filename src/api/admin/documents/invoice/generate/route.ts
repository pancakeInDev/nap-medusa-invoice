import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { InvoiceTemplateKind } from "../../../../../modules/documents/types/template-kind";
import { generateTestInvoiceWorkflow } from "../../../../../workflows/generate-test-invoice";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.query;
    const templateKind = query.template as InvoiceTemplateKind;
    const { result } = await generateTestInvoiceWorkflow(req.scope).run({
      input: {
        template: templateKind,
      },
    });
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

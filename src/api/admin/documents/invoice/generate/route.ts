import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/utils";
import { IOrderModuleService, OrderDTO } from "@medusajs/framework/types";

import { InvoiceTemplateKind } from "../../../../../modules/documents/types/template-kind";
import { DOCUMENTS_MODULE } from "../../../../../modules/documents";
import DocumentsModuleService from "../../../../../modules/documents/service";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const documentsModuleService: DocumentsModuleService =
    req.scope.resolve(DOCUMENTS_MODULE);

  const orderModuleService: IOrderModuleService = req.scope.resolve(
    Modules.ORDER
  );

  const lastOrders: OrderDTO[] = await orderModuleService.listOrders(
    {},
    {
      order: {
        created_at: "DESC",
      },
      take: 1,
      select: ["*", "item_total", "shipping_total", "tax_total"],
      relations: ["shipping_address", "billing_address", "items"],
    }
  );
  try {
    if (lastOrders && lastOrders.length) {
      const rawRequest = req as unknown as any;
      const templateKind = rawRequest.query.template;
      const result = await documentsModuleService.generateTestInvoice(
        lastOrders[0],
        templateKind as InvoiceTemplateKind
      );
      res.status(201).json(result);
    } else {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "You need to have at least one order to see preview"
      );
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

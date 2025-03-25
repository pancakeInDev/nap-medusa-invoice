import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { IOrderModuleService } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import DocumentsModuleService from "../../../modules/documents/service";
import { DOCUMENTS_MODULE } from "../../../modules/documents";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const documentsModuleService: DocumentsModuleService =
    req.scope.resolve(DOCUMENTS_MODULE);

  const orderId = req.query.orderId as string;
  const includeBuffer = req.query.includeBuffer;

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [orderWithInvoice],
    } = await query.graph({
      entity: "order",
      filters: {
        id: [orderId],
      },
      fields: ["document_invoice.*"],
    });
    if (orderWithInvoice.document_invoice && orderId) {
      const orderModuleService: IOrderModuleService = req.scope.resolve(
        Modules.ORDER
      );
      const orderDto = await orderModuleService.retrieveOrder(orderId, {
        select: ["*", "item_total", "shipping_total", "tax_total"],
        relations: ["shipping_address", "billing_address", "items"],
      });
      const result = await documentsModuleService.getInvoice(
        orderDto,
        orderWithInvoice.document_invoice.id,
        includeBuffer !== undefined
      );
      res.status(200).json(result);
    } else {
      const result = {
        invoice: undefined,
      };
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

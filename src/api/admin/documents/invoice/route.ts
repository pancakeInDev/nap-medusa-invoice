import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { generateOrderInvoiceWorkflow } from "../../../../workflows/generate-invoice";
import { retrieveOrderInvoiceWorkflow } from "../../../../workflows/retrieve-invoice";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { order_id } = req.body as { order_id: string };

    const { result } = await generateOrderInvoiceWorkflow(req.scope).run({
      input: {
        order_id,
      },
    });

    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const orderId = req.query.orderId as string;
  const includeBuffer = req.query.includeBuffer;

  try {
    const { result } = await retrieveOrderInvoiceWorkflow(req.scope).run({
      input: {
        order_id: orderId,
        includeBuffer: includeBuffer === "true",
      },
    });
    res.status(200).json(result);
  } catch (e) {
    const result = {
      invoice: undefined,
    };
    res.status(200).json(result);
  }
};

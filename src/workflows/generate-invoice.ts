import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { DOCUMENTS_MODULE } from "../modules/documents";
import { OrderDTO } from "@medusajs/framework/types";
import DocumentsModuleService, {
  GenerateInvoiceForOrderResult,
} from "../modules/documents/service";
import assignInvoiceToOrderWorkflow from "./assign-invoice";

const retrieveOrderStep = createStep(
  "retrieve-order",
  async (order_id: string, { container }) => {
    const orderModuleService = container.resolve(Modules.ORDER);
    const order: OrderDTO = await orderModuleService.retrieveOrder(order_id, {
      select: ["*", "item_total", "shipping_total", "tax_total"],
      relations: ["shipping_address", "billing_address", "items"],
    });
    if (!order) {
      throw new Error("Order not found in step retrieveOrderStep");
    }
    return new StepResponse(order);
  }
);

// Define the step outside the workflow
const generateInvoiceStep = createStep(
  "generate-invoice",
  async (order: OrderDTO, { container }) => {
    const documentsModuleService =
      container.resolve<DocumentsModuleService>(DOCUMENTS_MODULE);
    const result = await documentsModuleService.generateInvoiceForOrder(order);

    if (!result?.invoice) {
      throw new Error("Invoice not generated");
    }

    return new StepResponse(result, result.invoice?.id);
  }
);

interface GenerateInvoiceWorkflowInput {
  order_id: string;
}

export const generateOrderInvoiceWorkflow = createWorkflow(
  "generate-order-invoice",
  ({ order_id }: GenerateInvoiceWorkflowInput) => {
    // Step 1: Retrieve the order with necessary relations
    const order = retrieveOrderStep(order_id);

    const oldInvoiceId = transform({ order }, (order: any) =>
      order.document_invoice ? order.document_invoice.id : undefined
    );

    // Step 2: Generate the invoice for the order
    const invoice = generateInvoiceStep(order);

    // Step 3: Assign the invoice to the order
    assignInvoiceToOrderWorkflow.runAsStep({
      input: {
        orderId: order_id,
        newInvoiceId: invoice.invoice.id,
        oldInvoiceId: oldInvoiceId,
      },
    });

    return new WorkflowResponse<GenerateInvoiceForOrderResult>(invoice);
  }
);

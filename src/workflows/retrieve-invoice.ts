import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { DOCUMENTS_MODULE } from "../modules/documents";
import { OrderDTO } from "@medusajs/framework/types";
import DocumentsModuleService, {
  GenerateInvoiceForOrderResult,
} from "../modules/documents/service";
import { retrieveOrderStep } from "./commonSteps";

const getOrderWithInvoiceStep = createStep(
  "get-order-with-invoice",
  async (order_id: string, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [orderWithInvoice],
    } = await query.graph({
      entity: "order",
      filters: {
        id: [order_id],
      },
      fields: ["document_invoice.*"],
    });
    if (!orderWithInvoice?.document_invoice?.id) {
      throw new Error("Order with invoice not found");
    }
    return new StepResponse<string>(orderWithInvoice.document_invoice.id);
  }
);

// Define the step outside the workflow
const retrieveInvoiceStep = createStep(
  "retrieve-invoice",
  async (
    {
      order,
      invoiceId,
      includeBuffer,
    }: { order: OrderDTO; invoiceId: string; includeBuffer: boolean },
    { container }
  ) => {
    const documentsModuleService =
      container.resolve<DocumentsModuleService>(DOCUMENTS_MODULE);
    const result = await documentsModuleService.getInvoice(
      order,
      invoiceId,
      includeBuffer
    );

    if (!result?.invoice) {
      throw new Error("Invoice not generated");
    }

    return new StepResponse(result, result.invoice?.id);
  }
);

interface RetrieveOrderInvoiceWorkflowInput {
  order_id: string;
  includeBuffer: boolean;
}

export const retrieveOrderInvoiceWorkflow = createWorkflow(
  "retrieve-order-invoice",
  ({ order_id, includeBuffer }: RetrieveOrderInvoiceWorkflowInput) => {
    // Step 1: Get the order with invoice
    const invoiceId = getOrderWithInvoiceStep(order_id);

    // Step 2: Retrieve the order with necessary relations
    const order = retrieveOrderStep(order_id);

    // Step 3: Generate the invoice for the order
    const invoice = retrieveInvoiceStep({ order, invoiceId, includeBuffer });

    return new WorkflowResponse<GenerateInvoiceForOrderResult>(invoice);
  }
);

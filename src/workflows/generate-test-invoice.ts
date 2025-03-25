import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { DOCUMENTS_MODULE } from "../modules/documents";
import { IOrderModuleService, OrderDTO } from "@medusajs/framework/types";
import DocumentsModuleService, {
  GenerateInvoiceForOrderResult,
} from "../modules/documents/service";
import { SELECT_FIELDS_ORDER, RELATIONS_ORDER } from "./settings.const";
import { InvoiceTemplateKind } from "../modules/documents/types/template-kind";

const getLastOrderStep = createStep(
  "get-last-order",
  async (_, { container }) => {
    const orderModuleService: IOrderModuleService = container.resolve(
      Modules.ORDER
    );

    const lastOrders: OrderDTO[] = await orderModuleService.listOrders(
      {},
      {
        order: {
          created_at: "DESC",
        },
        take: 1,
        select: SELECT_FIELDS_ORDER,
        relations: RELATIONS_ORDER,
      }
    );
    if (!lastOrders[0]) {
      throw new Error("Last order not found");
    }
    return new StepResponse<OrderDTO>(lastOrders[0]);
  }
);

// Define the step outside the workflow
const generateTestInvoiceStep = createStep(
  "generate-test-invoice-step",
  async (
    { order, template }: { order: OrderDTO; template: InvoiceTemplateKind },
    { container }
  ) => {
    const documentsModuleService =
      container.resolve<DocumentsModuleService>(DOCUMENTS_MODULE);
    const result = await documentsModuleService.generateTestInvoice(
      order,
      template
    );

    if (!result?.invoice) {
      throw new Error("Invoice not generated");
    }

    return new StepResponse(result, result.invoice?.id);
  }
);

export const generateTestInvoiceWorkflow = createWorkflow(
  "generate-test-invoice",
  ({ template }: { template: InvoiceTemplateKind }) => {
    // Step 1: Get the order with invoice
    const order = getLastOrderStep();

    // Step 2: Generate the invoice for the order
    const invoice = generateTestInvoiceStep({
      order,
      template,
    });

    return new WorkflowResponse<GenerateInvoiceForOrderResult>(invoice);
  }
);

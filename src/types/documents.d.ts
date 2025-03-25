import { IOrderModuleService } from "@medusajs/framework/types";

export interface DocumentsModuleService {
  getInvoice(
    order: any,
    invoiceId: string,
    includeBuffer?: boolean
  ): Promise<any>;
}

export const DOCUMENTS_MODULE: string;

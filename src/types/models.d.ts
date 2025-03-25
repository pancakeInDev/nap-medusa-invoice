import { InferTypeOf } from "@mikro-orm/core";
import { DocumentInvoice } from "../modules/documents/models/document-invoice";

export type DocumentInvoiceType = InferTypeOf<typeof DocumentInvoice>;

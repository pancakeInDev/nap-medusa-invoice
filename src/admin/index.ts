// Export routes
import DocumentsPage, {
  config as documentsConfig,
} from "./routes/settings/documents/page";
// Export widgets
import OrderInvoiceWidget, {
  config as invoiceWidgetConfig,
} from "./widgets/order-invoice";

// Re-export with unique names
export {
  DocumentsPage,
  documentsConfig,
  OrderInvoiceWidget,
  invoiceWidgetConfig,
};

// This file ensures that admin components are properly discovered in production mode

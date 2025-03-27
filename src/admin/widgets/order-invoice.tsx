import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { OrderInvoice } from "../../ui-components/widgets/order-invoice";
import { AdminOrder } from "@medusajs/framework/types";
import { DetailWidgetProps } from "@medusajs/framework/types";

const OrderInvoiceWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  return <OrderInvoice data={data} />;
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderInvoiceWidget;

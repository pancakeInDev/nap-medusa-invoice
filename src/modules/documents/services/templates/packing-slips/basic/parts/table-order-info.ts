import { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types";
import { generateHr } from "./hr";
import { t } from "i18next";

function generateTableRow(doc, y, orderNumber, orderDate, shippingMethod) {
  doc
    .fontSize(10)
    .text(orderNumber, 50, y)
    .text(orderDate, 200, y)
    .text(shippingMethod, 0, y, { align: "right" });
}

export function generateOrderInfoTable(
  doc,
  y,
  order: OrderDTO,
  items: OrderLineItemDTO[]
): number {
  let i;
  const invoiceTableTop = y + 35;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("packing-slip-table-header-order-number", "Order #"),
    t("packing-slip-table-header-order-date", "Order date"),
    t("packing-slip-table-header-shipping-method", "Shipping method")
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Regular");

  const position = invoiceTableTop + 30;

  generateTableRow(
    doc,
    position,
    order.display_id,
    order.created_at.toLocaleString(),
    order.shipping_methods ? order.shipping_methods[0].name : "N/A"
  );

  generateHr(doc, position + 20);

  return position + 20;
}

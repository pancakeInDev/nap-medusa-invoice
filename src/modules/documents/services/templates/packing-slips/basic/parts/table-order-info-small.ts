import { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types";
import { generateHrInA7 } from "./hr";
import { t } from "i18next";

function generateTableRow(doc, y, orderNumber, orderDate, shippingMethod) {
  doc
    .fontSize(6)
    .text(orderNumber, 25, y)
    .text(orderDate, 80, y)
    .text(shippingMethod, 90, y, { align: "right", width: 100 });
}

export function generateOrderInfoTable(
  doc,
  y,
  order: OrderDTO,
  items: OrderLineItemDTO[]
): number {
  const invoiceTableTop = y + 25;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("packing-slip-table-header-order-number", "Order #"),
    t("packing-slip-table-header-order-date", "Order date"),
    t("packing-slip-table-header-shipping-method", "Shipping method")
  );
  generateHrInA7(doc, invoiceTableTop + 10);
  doc.font("Regular");

  const position = invoiceTableTop + 20;

  generateTableRow(
    doc,
    position,
    order.display_id,
    order.created_at.toLocaleString(),
    order.shipping_methods ? order.shipping_methods[0].name : "N/A"
  );

  generateHrInA7(doc, position + 10);

  return position + 10;
}

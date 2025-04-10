import { generateHr } from "./hr";
import { t } from "i18next";
import { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types";
import { getDecimalDigits } from "../../../../../utils/currency";
import { BigNumber } from "@medusajs/utils";

function amountToDisplay(amount: number, currencyCode: string): string {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `${(amount / Math.pow(10, decimalDigits)).toFixed(
    decimalDigits
  )} ${currencyCode.toUpperCase()}`;
}

function amountToDisplayNormalized(
  amount: number,
  currencyCode: string
): string {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `${parseFloat(amount.toString()).toFixed(
    decimalDigits
  )} ${currencyCode.toUpperCase()}`;
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

export function generateInvoiceTable(
  doc,
  y,
  order: OrderDTO,
  items: OrderLineItemDTO[]
) {
  let i;
  const invoiceTableTop = y + 35;

  doc.font("Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    t("invoice-table-header-item", "Item"),
    t("invoice-table-header-description", "Description"),
    t("invoice-table-header-unit-cost", "Unit Cost"),
    t("invoice-table-header-quantity", "Quantity"),
    t("invoice-table-header-line-total", "Line Total")
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Regular");

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.subtitle,
      amountToDisplayNormalized(
        item.unit_price / item.quantity,
        order.currency_code
      ),
      item.quantity,
      amountToDisplayNormalized(
        Number(item.raw_unit_price.value),
        order.currency_code
      )
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  if (!order.shipping_total) {
    throw new Error("parts/table.ts: Shipping total is not defined");
  }
  let shippingTotal = 0;
  if ((order.shipping_total as BigNumber)?.numeric) {
    shippingTotal = (order.shipping_total as BigNumber)?.numeric ?? 0;
  } else {
    shippingTotal = Number(order.shipping_total);
  }
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    t("invoice-table-shipping", "Shipping"),
    "",
    amountToDisplayNormalized(shippingTotal, order.currency_code)
  );
  const taxPosition = subtotalPosition + 30;
  if (!order.tax_total) {
    throw new Error("parts/table.ts: Tax total is not defined");
  }
  let taxTotal = 0;
  if ((order.tax_total as BigNumber)?.numeric) {
    taxTotal = (order.tax_total as BigNumber)?.numeric ?? 0;
  } else {
    taxTotal = Number(order.tax_total);
  }
  generateTableRow(
    doc,
    taxPosition,
    "",
    "",
    t("invoice-table-tax", "Tax"),
    "",
    amountToDisplayNormalized(taxTotal, order.currency_code)
  );
  const duePosition = taxPosition + 45;
  doc.font("Bold");
  if (!order.total) {
    throw new Error("parts/table.ts: Order total is not defined");
  }
  let total = 0;
  if ((order.total as BigNumber)?.numeric) {
    total = (order.total as BigNumber)?.numeric ?? 0;
  } else {
    total = Number(order.total);
  }
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    t("invoice-table-total", "Total"),
    "",
    amountToDisplayNormalized(total, order.currency_code)
  );
  doc.font("Regular");
}

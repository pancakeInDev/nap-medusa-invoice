import { OrderDTO } from "@medusajs/framework/types";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { RELATIONS_ORDER, SELECT_FIELDS_ORDER } from "./settings.const";

export const retrieveOrderStep = createStep(
  "retrieve-order",
  async (order_id: string, { container }) => {
    const orderModuleService = container.resolve(Modules.ORDER);
    const order: OrderDTO = await orderModuleService.retrieveOrder(order_id, {
      select: SELECT_FIELDS_ORDER,
      relations: RELATIONS_ORDER,
    });
    if (!order) {
      throw new Error("Order not found in step retrieveOrderStep");
    }
    return new StepResponse(order);
  }
);

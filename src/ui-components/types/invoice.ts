import { OrderDTO } from "@medusajs/framework/types";

export type Invoice = {
  id: string;
  number: string;
  display_number: string;
  order: OrderDTO;
  created_at: Date;
};

import { OrderDTO } from "@medusajs/framework/types";

export type PackingSlip = {
  id: string;
  number: string;
  display_number: string;
  order: OrderDTO;
  created_at: Date;
};

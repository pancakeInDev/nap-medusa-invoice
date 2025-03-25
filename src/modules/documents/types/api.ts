import { BaseAddress } from "@medusajs/framework/types";

export type DocumentAddress = Omit<
  BaseAddress,
  "metadata" | "created_at" | "updated_at" | "customer_id"
>;

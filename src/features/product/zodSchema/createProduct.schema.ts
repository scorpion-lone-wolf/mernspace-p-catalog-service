import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().nonempty({ error: "Product name is required" }),
  description: z.string().nonempty({ error: "Description is required" }),
  priceConfiguration: z.record(
    z.string(),
    z.object({
      priceType: z.enum(["base", "additional"]),
      availableOptions: z.record(z.string(), z.number()),
    }),
  ),
  attribute: z.array(
    z.object({
      name: z.string(),
      value: z.unknown(),
    }),
  ),
  tenantId: z.string().nonempty({ error: "Tenant is required" }),
  categoryId: z.string().nonempty({ error: "Category is required" }),
  isPublished: z.coerce.boolean().default(false),
});

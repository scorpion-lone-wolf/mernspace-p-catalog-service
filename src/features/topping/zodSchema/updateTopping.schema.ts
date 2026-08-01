import z from "zod";

export const updateToppingSchema = z.object({
  name: z.string().nonempty({ error: "Topping name is required" }).optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0").optional(),
  tenantId: z.string().nonempty({ error: "Tenant is required" }).optional(),
  isPublished: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

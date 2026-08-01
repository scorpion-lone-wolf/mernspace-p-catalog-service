import z from "zod";

export const createToppingSchema = z.object({
  name: z.string().nonempty({ error: "Topping name is required" }),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  tenantId: z.string().nonempty({ error: "Tenant is required" }),
  isPublished: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default(false),
});

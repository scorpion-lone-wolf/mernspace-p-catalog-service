import z from "zod";

export const getProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  search: z.string().optional().default(""),
  tenantId: z.uuid().optional().default(""),
  categoryId: z.string().optional().default(""),
  isPublished: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default(true),
});

// NOTE:
// z.coerce.number() => converts input to number

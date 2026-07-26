import { z } from "zod";

export const imageSchema = z.object({
  mimetype: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().max(3 * 1024 * 1024, "Image must be less than 3 MB"),
});

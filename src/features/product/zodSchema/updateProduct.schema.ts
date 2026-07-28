import { createProductSchema } from "./createProduct.schema.js";

export const updateProductSchema = createProductSchema.partial();

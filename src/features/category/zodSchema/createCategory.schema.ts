import { z } from "zod";

const CreateCategorySchema = z.object({
  name: z.string().nonempty({ error: "Name is required" }),
  priceConfiguration: z.record(
    z.string(),
    z.object({
      priceType: z.enum(["base", "additional"]),
      availableOptions: z.array(z.string()),
    }),
  ),
  attributes: z.array(
    z.object({
      name: z.string(),
      widgetType: z.enum(["radio", "switch"]),
      defaultValue: z.string(),
      availableOptions: z.array(z.string()),
    }),
  ),
});
export default CreateCategorySchema;

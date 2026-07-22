import mongoose from "mongoose";
import type { Attribute, Category, PriceConfiguration } from "./types.js";
// define schema
const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
  priceType: {
    type: String,
    enum: ["base", "additional"],
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
});
const attributeSchema = new mongoose.Schema<Attribute>({
  name: {
    type: String,
    required: true,
  },
  widgetType: {
    type: String,
    enum: ["radio", "switch"],
    required: true,
  },
  defaultValue: {
    type: String,
    required: true,
  },
  availableOptions: {
    type: [String],
    required: true,
  },
});
const categorySchema = new mongoose.Schema<Category>({
  name: {
    type: String,
    required: true,
  },
  priceConfiguration: {
    type: Map,
    of: priceConfigurationSchema,
    required: true,
  },
  attributes: {
    type: [attributeSchema],
    required: true,
  },
});
// create model based on schema (collection will be categories)
export default mongoose.model("Category", categorySchema);

import mongoose from "mongoose";
import type { Topping } from "./types.js";

const toppingSchema = new mongoose.Schema<Topping>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const ToppingModel = mongoose.model<Topping>("Topping", toppingSchema);

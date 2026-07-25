import mongoose from "mongoose";

const attributeValueSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const priceConfigurationSchema = new mongoose.Schema({
  priceType: {
    type: String,
    enum: ["base", "additional"],
    required: true,
  },
  availableOptions: {
    type: Map,
    of: Number,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    //   We will store the s3 /cloudinary url in our database
    image: {
      type: String,
      required: true,
    },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
    },
    attribute: {
      type: [attributeValueSchema],
    },
    tenantId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = mongoose.model("Product", productSchema);

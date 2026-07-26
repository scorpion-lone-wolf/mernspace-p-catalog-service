import type mongoose from "mongoose";

export type Product = {
  name: string;
  description: string;
  image: string;
  priceConfiguration: Map<
    string,
    {
      priceType: string;
      availableOptions: Map<string, number>;
    }
  >;
  attribute: Array<{
    name: string;
    value: string | number | boolean;
  }>;
  categoryId: mongoose.Schema.Types.ObjectId;
  tenantId: string;
  isPublished: boolean;
};

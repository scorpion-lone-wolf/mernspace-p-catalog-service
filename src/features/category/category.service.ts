import { CategoryModel } from "./category.model.js";
import type { Category } from "./types.js";

export class CategoryService {
  async createCategory({ name, priceConfiguration, attributes }: Category) {
    const result = await CategoryModel.create({
      name,
      priceConfiguration,
      attributes,
    });

    return result;
  }
}

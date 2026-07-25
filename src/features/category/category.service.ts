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

  async getAllCategories({ pageNumber = 1, limitNumber = 10 }) {
    const skip = (pageNumber - 1) * limitNumber;
    const [categories, count] = await Promise.all([
      CategoryModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
      CategoryModel.countDocuments(),
    ]);
    return { categories, count };
  }
  async getCategory(id: string) {
    const category = await CategoryModel.findById(id);
    return category;
  }
}

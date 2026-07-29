import { ProductModel } from "./product.model.js";
import type { Product } from "./types.js";

export class ProductService {
  async createProduct(product: Product) {
    return await ProductModel.create(product);
  }
  async updateProduct(productId: string, updateData: Partial<Product>) {
    return ProductModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async getProduct(id: string) {
    return await ProductModel.findById(id);
  }
  async getAllProduct({
    pageNumber,
    limitNumber,
    search,
    tenantId,
    categoryId,
    isPublished,
  }: {
    pageNumber: number;
    limitNumber: number;
    search?: string;
    tenantId?: string;
    categoryId?: string;
    isPublished?: boolean;
  }) {
    const filters: Record<string, any> = {};
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } }, // case insensitive regex search in name filed
        { description: { $regex: search, $options: "i" } }, // case insensitive regex search in description filed
      ];
      // reset page number to 1
      pageNumber = 1;
    }
    if (tenantId) {
      filters.tenantId = tenantId;
    }
    if (categoryId) {
      filters.categoryId = categoryId;
    }
    if (isPublished !== undefined) {
      filters.isPublished = isPublished;
    }

    // if categoryId is given then we need to fetch the category details and add that in response as well
    // monogoose populate does this automatically
    const [products, count] = await Promise.all([
      ProductModel.find(filters)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate("categoryId", "_id name attributes priceConfiguration")
        .exec(),
      ProductModel.countDocuments(filters),
    ]);
    return { products, count };
  }
}

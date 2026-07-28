import { ProductModel } from "./product.model.js";
import type { Product } from "./types.js";

export class ProductService {
  async createProduct(product: Product) {
    return await ProductModel.create(product);
  }
  async updateProduct(productId: string, updateData: Partial<Product>) {
    return await ProductModel.findOneAndUpdate({ _id: productId }, updateData);
  }

  async getProduct(id: string) {
    return await ProductModel.findById(id);
  }
}

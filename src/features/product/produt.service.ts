import { ProductModel } from "./product.model.js";
import type { Product } from "./types.js";

export class ProductService {
  async createProduct(product: Product) {
    return await ProductModel.create(product);
  }
}

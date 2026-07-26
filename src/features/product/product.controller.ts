import type { Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import type { ProductService } from "./produt.service.js";
import type { Product } from "./types.js";
export class ProductController {
  constructor(
    private readonly logger: Logger,
    private readonly productService: ProductService,
  ) {}
  async createProduct(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        priceConfiguration,
        attribute,
        tenantId,
        categoryId,
      } = req.body;
      const image = req.file;
      this.logger.info("New Request to create product");
      const productData = await this.productService.createProduct({
        name,
        description,
        priceConfiguration,
        attribute,
        tenantId,
        categoryId,
        image: "my-image-url",
      } as Product);
      res.json({ id: productData._id });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to create Product");
    }
  }

  getAllProduct(req: Request, res: Response) {}
  getProduct(req: Request, res: Response) {}

  updateProduct(req: Request, res: Response) {}

  deleteProduct(req: Request, res: Response) {}
}

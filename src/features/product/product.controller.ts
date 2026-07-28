import type { Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import type { FileStorage } from "../../interface/storage.interface.js";
import type { ProductService } from "./produt.service.js";
import type { Product } from "./types.js";
export class ProductController {
  constructor(
    private readonly logger: Logger,
    private readonly productService: ProductService,
    // implemented Dependency Inversion principle
    private readonly storage: FileStorage,
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
      let imageUrl: string | undefined = "";
      this.logger.info("New Request to create product");

      if (image) {
        // save image to s3 -> will return s3 public url
        const imageName = crypto.randomUUID() + image.originalname;
        await this.storage.upload({
          fileName: imageName,
          fileData: image.buffer,
          contentType: image.mimetype,
        });
        imageUrl = this.storage.getObjectUrl(imageName);
        this.logger.info("Image uploaded to s3");
      }
      // send that publi url to catalog service to save along with other infomration
      const productData = await this.productService.createProduct({
        name,
        description,
        priceConfiguration,
        attribute,
        tenantId,
        categoryId,
        image: imageUrl,
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

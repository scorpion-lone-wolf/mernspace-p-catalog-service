import type { Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import { imageUploadToS3 } from "../../common/utils/fileupload.js";
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
        await imageUploadToS3(image, this.storage, imageName);
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

  async updateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const image = req.file;
      const {
        name,
        description,
        priceConfiguration,
        attribute,
        tenantId,
        categoryId,
      } = req.body;
      const updateData: Partial<Product> = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (priceConfiguration !== undefined)
        updateData.priceConfiguration = priceConfiguration;
      if (attribute !== undefined) updateData.attribute = attribute;
      if (tenantId !== undefined) updateData.tenantId = tenantId;
      if (categoryId !== undefined) updateData.categoryId = categoryId;

      if (image) {
        // save image to s3 -> will return s3 public url
        const imageName = crypto.randomUUID() + image.originalname;
        await imageUploadToS3(image, this.storage, imageName);
        const imageUrl = this.storage.getObjectUrl(imageName);
        updateData.image = imageUrl;
        this.logger.info("Image uploaded to s3");
      }
      const response = await this.productService.updateProduct(
        productId as string,
        updateData,
      );
      return res.json(response);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to Update Product");
    }
  }

  deleteProduct(req: Request, res: Response) {}
}

import type { Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import { UserRole } from "../../common/enums/index.js";
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
      // check if product exist or not
      const product = await this.productService.getProduct(productId as string);
      if (!product) {
        throw createHttpError(404, "Product not found");
      }
      // check if user is manager then he can only update
      // when the product belongs to the same tenant in which he belongs
      if (req.user?.role === UserRole.MANAGER) {
        if (product.tenantId !== req.user.tenant) {
          throw createHttpError(
            403,
            "Forbidden, You can't update this product",
          );
        }
      }
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
        // remove the old image first
        if (product) {
          // extract the file name from the url
          const imageName = product.image.split("/").pop();
          await this.storage.delete(imageName as string);
        }
        //  save image to s3 -> will return s3 public url
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

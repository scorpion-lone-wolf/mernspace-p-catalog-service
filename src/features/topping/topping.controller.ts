import type { Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import { UserRole } from "../../common/enums/index.js";
import { imageSchema } from "../../common/zodSchema/image.schema.js";
import { imageUploadToS3 } from "../../common/utils/fileupload.js";
import type { FileStorage } from "../../interface/storage.interface.js";
import type { ToppingService } from "./topping.service.js";

export class ToppingController {
  constructor(
    private logger: Logger,
    private storage: FileStorage,
    private toppingService: ToppingService,
  ) {}

  async createTopping(req: Request, res: Response) {
    try {
      const { name, price, tenantId, isPublished } = req.body;
      const image = req?.file;
      let imageUrl = "";
      if (image) {
        // we need to upload image to s3
        const imageName = crypto.randomUUID() + image.originalname;
        await imageUploadToS3(image, this.storage, imageName);
        imageUrl = this.storage.getObjectUrl(imageName);
      }

      const topping = await this.toppingService.createTopping({
        name,
        price,
        tenantId,
        isPublished,
        image: imageUrl,
      });
      return res.json({
        message: "Topping created successfully",
        id: topping._id,
      });
    } catch (error) {
      this.logger.error(error);
      if (typeof error === "object" && error !== null && "statusCode" in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to create Topping");
    }
  }

  async getAllToppings(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const pageNumber = Math.max(1, Number(page) || 1);
      const limitNumber = Math.max(1, Number(limit) || 10);
      const { toppings, count } = await this.toppingService.getAllToppings({
        pageNumber,
        limitNumber,
      });
      return res.json({
        data: toppings,
        total: count,
        page: pageNumber,
        limit: limitNumber,
      });
    } catch (error) {
      this.logger.error(error);
      if (typeof error === "object" && error !== null && "statusCode" in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to get Toppings");
    }
  }

  async getTopping(req: Request, res: Response) {
    try {
      const { toppingId } = req.params;
      const topping = await this.toppingService.getTopping(toppingId as string);
      if (!topping) {
        throw createHttpError(404, "Topping not found");
      }
      return res.json({ data: topping });
    } catch (error) {
      this.logger.error(error);
      if (typeof error === "object" && error !== null && "statusCode" in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to get Topping");
    }
  }

  async updateTopping(req: Request, res: Response) {
    try {
      const { toppingId } = req.params;
      const topping = await this.toppingService.getTopping(toppingId as string);
      if (!topping) {
        throw createHttpError(404, "Topping not found");
      }

      if (req.user?.role === UserRole.MANAGER) {
        if (topping.tenantId !== req.user.tenant) {
          throw createHttpError(403, "Forbidden, You can't update this topping");
        }
      }

      const image = req.file;
      const { name, price, tenantId, isPublished } = req.body;
      const updateData: Record<string, unknown> = {};

      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = price;
      if (tenantId !== undefined) updateData.tenantId = tenantId;
      if (isPublished !== undefined) updateData.isPublished = isPublished;

      if (image) {
        const validation = imageSchema.safeParse(image);
        if (!validation.success) {
          const issue = validation.error.issues[0];
          const path = issue?.path.join(".") ?? "image";
          const message = issue?.message ?? "Invalid image";
          throw createHttpError(400, `${path}: ${message}`);
        }

        if (topping.image) {
          const imageName = topping.image.split("/").pop();
          if (imageName) {
            await this.storage.delete(imageName);
          }
        }

        const imageName = crypto.randomUUID() + image.originalname;
        await imageUploadToS3(image, this.storage, imageName);
        updateData.image = this.storage.getObjectUrl(imageName);
      }

      const updatedTopping = await this.toppingService.updateTopping(
        toppingId as string,
        updateData,
      );

      return res.json({
        message: "Topping updated successfully",
        data: updatedTopping,
      });
    } catch (error) {
      this.logger.error(error);
      if (typeof error === "object" && error !== null && "statusCode" in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to update Topping");
    }
  }

  async deleteTopping(req: Request, res: Response) {
    try {
      const { toppingId } = req.params;
      const topping = await this.toppingService.getTopping(toppingId as string);
      if (!topping) {
        throw createHttpError(404, "Topping not found");
      }

      if (req.user?.role === UserRole.MANAGER) {
        if (topping.tenantId !== req.user.tenant) {
          throw createHttpError(403, "Forbidden, You can't delete this topping");
        }
      }

      if (topping.image) {
        const imageName = topping.image.split("/").pop();
        if (imageName) {
          await this.storage.delete(imageName);
        }
      }

      await this.toppingService.deleteTopping(toppingId as string);
      return res.json({ message: "Topping deleted successfully" });
    } catch (error) {
      this.logger.error(error);
      if (typeof error === "object" && error !== null && "statusCode" in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to delete Topping");
    }
  }
}

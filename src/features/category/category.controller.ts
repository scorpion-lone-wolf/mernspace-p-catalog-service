import type { Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import type { CategoryService } from "./category.service.js";

export class CategoryController {
  constructor(
    private readonly logger: Logger,
    private readonly categoryService: CategoryService,
  ) {}

  async create(req: Request, res: Response) {
    try {
      // get the name ,  priceConfiguration and attributes from the request body
      const { name, priceConfiguration, attributes } = req.body;
      //   call the category service and pass all the data
      const result = await this.categoryService.createCategory({
        name,
        priceConfiguration,
        attributes,
      });
      this.logger.info(`Category created successfully with id: ${result._id}`);
      return res.json({ id: result._id });
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to create Category");
    }
  }
}

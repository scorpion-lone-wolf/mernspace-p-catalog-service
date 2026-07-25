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
  async getCategories(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const pageNumber = Math.max(1, Number(page) || 1);
      const limitNumber = Math.max(1, Number(limit) || 10);
      const { categories, count } = await this.categoryService.getAllCategories(
        {
          pageNumber,
          limitNumber,
        },
      );
      return res.json({
        data: categories,
        total: count,
        page: pageNumber,
        limit: limitNumber,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to get Categories");
    }
  }
  async getCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategory(id as string);
      return res.json({ data: category });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to get Category");
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, priceConfiguration, attributes } = req.body;
      await this.categoryService.updateCategory(id as string, {
        name,
        priceConfiguration,
        attributes,
      });
      return res.json({ message: "Category updated successfully" });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to update Category");
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id as string);
      this.logger.info(`Category deleted successfully with id: ${id}`);
      return res.json({ message: "Category deleted successfully" });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof Error) {
        throw createHttpError(400, error.message);
      }
      throw createHttpError(500, "Failed to delete Category");
    }
  }
}

import express, { type Request, type Response } from "express";
import { logger } from "../../config/logger.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";
import categoryValidator from "./category.validator.js";
import CreateCategorySchema from "./createCategory.schema.js";

const categoryRouter = express.Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(logger, categoryService);
categoryRouter.post(
  "/",
  authenticate,
  categoryValidator(CreateCategorySchema),
  (req: Request, res: Response) => categoryController.create(req, res),
);

export default categoryRouter;

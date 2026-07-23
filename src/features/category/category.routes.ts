import express, { type Request, type Response } from "express";
import { CategoryController } from "./category.controller.js";
import categoryValidator from "./category.validator.js";
import CreateCategorySchema from "./createCategory.schema.js";

const categoryRouter = express.Router();

const categoryController = new CategoryController();
categoryRouter.post(
  "/",
  categoryValidator(CreateCategorySchema),
  (req: Request, res: Response) => categoryController.create(req, res),
);

export default categoryRouter;

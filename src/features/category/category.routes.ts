import express, { type Request, type Response } from "express";
import { UserRole } from "../../common/enums/index.js";
import { authenticate } from "../../common/middlewares/authenticate.js";
import authorized from "../../common/middlewares/authorized.js";
import { default as bodyValidator } from "../../common/middlewares/body.validator.js";
import { logger } from "../../config/logger.js";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";
import CreateCategorySchema from "./zodSchema/createCategory.schema.js";
import UpdateCategorySchema from "./zodSchema/updateCategory.schema.js";

const categoryRouter = express.Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(logger, categoryService);

categoryRouter.post(
  "/",
  authenticate,
  authorized([UserRole.ADMIN]),
  bodyValidator(CreateCategorySchema),
  (req: Request, res: Response) => categoryController.create(req, res),
);

// this is public endpoint
categoryRouter.get("/", (req: Request, res: Response) =>
  categoryController.getCategories(req, res),
);

// this is public endpoint
categoryRouter.get("/:id", (req: Request, res: Response) =>
  categoryController.getCategory(req, res),
);

categoryRouter.patch(
  "/:id",
  bodyValidator(UpdateCategorySchema),
  authenticate,
  authorized([UserRole.ADMIN]),
  (req: Request, res: Response) => categoryController.updateCategory(req, res),
);

categoryRouter.delete(
  "/:id",
  authenticate,
  authorized([UserRole.ADMIN]),
  (req: Request, res: Response) => categoryController.deleteCategory(req, res),
);

export default categoryRouter;

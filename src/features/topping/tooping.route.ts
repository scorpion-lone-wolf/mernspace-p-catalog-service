import express, { type Request, type Response } from "express";
import multer from "multer";
import { UserRole } from "../../common/enums/index.js";
import { authenticate } from "../../common/middlewares/authenticate.js";
import authorized from "../../common/middlewares/authorized.js";
import bodyValidator from "../../common/middlewares/body.validator.js";
import fileValidator from "../../common/middlewares/file.validator.js";
import { S3StorageService } from "../../common/services/s3Storage.service.js";
import { imageSchema } from "../../common/zodSchema/image.schema.js";
import { logger } from "../../config/logger.js";
import { ToppingController } from "./topping.controller.js";
import { ToppingService } from "./topping.service.js";
import { createToppingSchema } from "./zodSchema/createTopping.schema.js";
import { updateToppingSchema } from "./zodSchema/updateTopping.schema.js";

const toppingRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

const s3Storage = new S3StorageService();
const toppingService = new ToppingService();
const toppingController = new ToppingController(
  logger,
  s3Storage,
  toppingService,
);
// routes
toppingRouter.post(
  "/",
  authenticate,
  authorized([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single("image"),
  bodyValidator(createToppingSchema),
  fileValidator(imageSchema),
  (req: Request, res: Response) => toppingController.createTopping(req, res),
);

toppingRouter.get("/", (req: Request, res: Response) =>
  toppingController.getAllToppings(req, res),
);

toppingRouter.get("/:toppingId", (req: Request, res: Response) =>
  toppingController.getTopping(req, res),
);

toppingRouter.patch(
  "/:toppingId",
  authenticate,
  authorized([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single("image"),
  bodyValidator(updateToppingSchema),
  (req: Request, res: Response) => toppingController.updateTopping(req, res),
);

toppingRouter.delete(
  "/:toppingId",
  authenticate,
  authorized([UserRole.ADMIN, UserRole.MANAGER]),
  (req: Request, res: Response) => toppingController.deleteTopping(req, res),
);

export default toppingRouter;

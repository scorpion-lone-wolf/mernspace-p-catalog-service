import express, { type Request, type Response } from "express";
import multer from "multer";
import { UserRole } from "../../common/enums/index.js";
import { authenticate } from "../../common/middlewares/authenticate.js";
import authorized from "../../common/middlewares/authorized.js";
import bodyValidator from "../../common/middlewares/body.validator.js";
import fileValidator from "../../common/middlewares/file.validator.js";
import { S3StorageService } from "../../common/services/s3Storage.service.js";
import { logger } from "../../config/logger.js";
import parseJsonFields from "./middleware/parseJsonFields.validator.js";
import { ProductController } from "./product.controller.js";
import { ProductService } from "./produt.service.js";
import { createProductSchema } from "./zodSchema/createProduct.schema.js";
import { imageSchema } from "./zodSchema/image.schema.js";
import { updateProductSchema } from "./zodSchema/updateProduct.schema.js";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

const productRouter = express.Router();

const productService = new ProductService();
// Added s3Storage service as a dependency
const s3Storage = new S3StorageService();
const productController = new ProductController(
  logger,
  productService,
  s3Storage,
);

productRouter.post(
  "/",
  authenticate,
  authorized([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single("image"), // this middleware ensures that the file object is present in req.file
  parseJsonFields(["priceConfiguration", "attribute"]),
  bodyValidator(createProductSchema),
  fileValidator(imageSchema),
  (req: Request, res: Response) => productController.createProduct(req, res),
);

productRouter.patch(
  "/:productId",
  authenticate,
  authorized([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single("image"), // this middleware ensures that the file object is present in req.file
  parseJsonFields(["priceConfiguration", "attribute"]),
  bodyValidator(updateProductSchema),
  (req: Request, res: Response) => productController.updateProduct(req, res),
);

productRouter.get("/", (req: Request, res: Response) =>
  productController.getAllProduct(req, res),
);

productRouter.get("/:productId", (req: Request, res: Response) =>
  productController.getProduct(req, res),
);
export default productRouter;

// Multer Middleware take the file type from multipart/form-data and stores it in req.file
// and all the other fields in req.body in the form of key value pair  both are stringified

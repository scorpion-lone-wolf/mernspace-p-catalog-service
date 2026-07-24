import cookieParser from "cookie-parser";
import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler.js";
import categoryRouter from "./features/category/category.routes.js";
const app = express();
// Remove the X-Powered-By header
app.disable("x-powered-by");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Catalog service! " });
});
// routes
app.use("/categories", categoryRouter);

app.use(globalErrorHandler);

export default app;

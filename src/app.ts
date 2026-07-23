import express from "express";
import categoryRouter from "./features/category/category.routes.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
const app = express();
// Remove the X-Powered-By header
app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Catalog service! " });
});
// routes
app.use("/category", categoryRouter);

app.use(globalErrorHandler);

export default app;

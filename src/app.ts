import express from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
const app = express();
// Remove the X-Powered-By header
app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Catalog service! " });
});

app.use(globalErrorHandler);

export default app;

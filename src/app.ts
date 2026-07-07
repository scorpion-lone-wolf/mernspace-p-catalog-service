import express from "express";

const app = express();
// Remove the X-Powered-By header
app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Catalog Service is cooking!");
});

export default app;

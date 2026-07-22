import config from "config";
import app from "./app.js";
import { logger } from "./config/logger.js";

const startServer = () => {
  const PORT: number = config.get("server.port") || 5502;
  app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
  });
};

startServer();

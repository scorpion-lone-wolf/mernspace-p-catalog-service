import app from "./app.js";
import config from "./config/index.js";
import { logger } from "./config/logger.js";

const PORT = config.PORT || 5502;
const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
  });
};

startServer();

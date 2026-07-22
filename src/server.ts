import config from "config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./config/logger.js";

const startServer = async () => {
  const PORT: number = config.get("server.port") || 5502;
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
};

await startServer();

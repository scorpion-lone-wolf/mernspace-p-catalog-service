import config from "config";
import mongoose from "mongoose";
import { logger } from "./logger.js";
export const connectDB = async () => {
  try {
    mongoose.connect(config.get("database.uri"));
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

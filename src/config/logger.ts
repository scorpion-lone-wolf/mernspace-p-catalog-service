import winston from "winston";

const currentEnv = process.env.NODE_ENV || "development";
export const logger = winston.createLogger({
  // setup log levels
  level: currentEnv === "production" ? "info" : "debug",
  defaultMeta: { service: "catalog-service" },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    // show the log in console
    new winston.transports.Console({
      silent: currentEnv === "test",
    }),
    // store the error level log in error.log file
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      dirname: "logs",
      silent: currentEnv === "test",
    }),
    // this store all the logs irrespective of the level
    new winston.transports.File({
      filename: "combined.log",
      dirname: "logs",
      silent: currentEnv === "test",
    }),
  ],
});

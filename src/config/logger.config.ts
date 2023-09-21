import winston, { format, transports, createLogger, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config/config.config";

const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    info.message = {
      stack: info.message.stack,
      ...info.message,
    };
  }

  if (info instanceof Error) {
    return {
      stack: info.stack,
      ...info,
    };
  }

  return info;
});

const transport = new DailyRotateFile({
  filename: config.logConfig.logFolder + config.logConfig.logFile,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "3",
});

export const logger: Logger = createLogger({
  format: format.combine(enumerateErrorFormat(), format.json()),
  transports: [
    transport,
    new transports.Console({
      level: "info",
    }),
  ],
});

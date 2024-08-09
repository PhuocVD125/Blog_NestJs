// src/common/logging/winston.config.ts
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const transportOptions: winston.transports.DailyRotateFileTransportOptions = {
  filename: 'application-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.DailyRotateFile(transportOptions as any), // Cast to `any` to avoid type issues
  ],
});

export default logger;

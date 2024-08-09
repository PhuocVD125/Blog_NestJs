// src/common/logging/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import logger from './winston.config';

@Injectable()
export class Logger implements LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string, trace: string) {
    logger.error(message, { trace });
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }

  verbose(message: string) {
    logger.verbose(message);
  }
}

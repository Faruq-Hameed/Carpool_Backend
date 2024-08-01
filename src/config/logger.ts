import { format, transports, createLogger, type Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '@/config/dev';

const enumerateErrorFormat = format(info => {
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
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '3',
});

export const logger: Logger = createLogger({
  format: format.combine(
    format.timestamp(), // Add timestamp to the log entries
    enumerateErrorFormat(),
    format.errors({ stack: true }), // Enumerate errors (assuming this is a custom format you have) making sure the error object is logged and preserved
    format.printf(({ level, message, timestamp, stack }) => {
      return JSON.stringify({ eventTime: timestamp, level, message, stack });
    }), // Using custom format to structure log output to allow error time log for better tracking
  ),
  transports: [
    transport,
    new transports.Console({
      level: 'info',
    }),
  ],
});

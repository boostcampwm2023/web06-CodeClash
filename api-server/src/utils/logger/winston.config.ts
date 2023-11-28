import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as moment from 'moment-timezone';

const dailyOptions = {
  level: ' http',
  datePattern: 'YYYY-MM-DD',
  dirname: process.env.LOG_DIR,
  filename: `%DATE%.log`,
  maxFiles: 30,
  zippedArchive: true,
  colorize: false,
  handleExceptions: true,
  json: false,
};

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format();
  }
  return info;
});

export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'http',
      format: winston.format.simple(),
    }),

    new winstonDaily(dailyOptions),
  ],
  format: winston.format.combine(
    appendTimestamp({ tz: 'Asia/Seoul' }),
    winston.format.json(),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}] ${info.message}`;
    }),
  ),
});

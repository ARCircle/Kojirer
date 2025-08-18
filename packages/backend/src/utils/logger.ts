import winston from 'winston';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const devFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
    const metaString = Object.keys(metadata).length > 0 ? `: ${JSON.stringify(metadata)}` : '';
    return `${timestamp} [${level}]: ${message}${metaString}${stack ? `\n${stack}` : ''}`;
  }),
);

const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: isDevelopment ? devFormat : logFormat,
  transports: [
    new winston.transports.Console(),
    ...(isDevelopment
      ? []
      : [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ]),
  ],
  exitOnError: false,
});

export { logger };

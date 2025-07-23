import winston from 'winston';




const getNepalTimestamp = () => {
  const offsetInMinutes = (5 * 60 + 45) * 60 * 1000; 
  const now = new Date(Date.now() + offsetInMinutes );
  return now.toISOString();
};

const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return JSON.stringify({
    timestamp,
    level,
    service: 'user-service',
    message,
    ...meta
  });
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp( { format : getNepalTimestamp}),
    // winston.format.json()
    winston.format.errors({ stack: true }),
    customFormat 
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: './log/errorLog.log', level: 'error' }),
    new winston.transports.File({ filename: './log/routeLog.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format:  winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
  }));
}

export const loggerMiddleware = (req: any, res: any, next: any) => {
  logger.info("Logger middleware triggered");

  const { method, originalUrl  } = req;
  const userAgent = req.get('user-agent') || '';

  // logger.info(`--> ${method} ${originalUrl} - User-Agent: ${userAgent}`);
  logger.info({
    method,
    url: originalUrl,
    userAgent,
    message: `--> ${method} ${originalUrl}`
  });

  // res.on('finish', () => {
  //   logger.info(`<-- ${method} ${originalUrl} - Status: ${res.statusCode}`);
  // });
   res.on('finish', () => {
    logger.info({
      method,
      url: originalUrl,
      status: res.statusCode,
      userAgent,
      message: `<-- ${method} ${originalUrl}`
    });
  });

  next();
};



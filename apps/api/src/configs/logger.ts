import { pino } from "pino";
import { pinoHttp } from "pino-http";
import { env } from "./env.js";
import { type Request, type Response } from "express"

const isDevelopment = env.NODE_ENV !== 'production';

export const logger = pino({
  ...(isDevelopment && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        singleLine: true,
      },
    },
  }),
});

export const httpLogger = pinoHttp({
  logger, serializers: {
    req: (req: Request) => ({
      method: req.method,
      url: req.url,
    }),

    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
  },
});

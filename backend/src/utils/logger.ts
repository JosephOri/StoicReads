import pino, { Logger } from "pino";

const logger: Logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      colorizeObjects: true,
    },
  },
});

export default logger;

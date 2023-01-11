const winston = require("winston");
const chalk = require("chalk");
const { format } = require("date-fns");
const path = require("path");
require("winston-daily-rotate-file");

const colors = {
  warn: chalk.yellow,
  info: chalk.cyan,
  debug: chalk.gray,
  error: chalk.red,
  http: chalk.white,
};

const logger = winston.createLogger({
  level: "debug", 
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const color = colors[info.level];
          const date = chalk.gray(
            format(new Date(info.timestamp), "[dd/MM/yyyy hh:mm:ss]")
          );

          return [date, color(info.message.replace("\n", ""))].join(" ");
        })
      ),
    }),
    new winston.transports.DailyRotateFile({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      filename: path.join(process.env.LOGS_PATH, "%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

module.exports = logger;
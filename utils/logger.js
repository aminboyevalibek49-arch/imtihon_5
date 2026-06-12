const { createLogger, format, transports } = require("winston");
require("winston-mongodb");

// Faqat INFO va DEBUG (error/warn bo'lmagan) loglar uchun filtr
const onlyLowLevelFilter = format((info) => {
  return info.level !== "error" && info.level !== "warn" ? info : false;
});

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json(),
  ),
  transports: [
    // 1. Konsol
    new transports.Console({
      format: format.simple(),
    }),

    // 2. MongoDB - ERRORLAR
    new transports.MongoDB({
      db: process.env.MONGO_URI,
      level: "error",
      collection: "error_logs",
      storeHost: true, // Qaysi serverdan kelganini bilish uchun
      capsule: true, // Ma'lumotlarni obyekt ichida saqlash
    }),

    // 3. MongoDB - WARNINGLAR
    new transports.MongoDB({
      db: process.env.MONGO_URI,
      level: "warn",
      collection: "warning_logs",
      format: format.combine(
        format((info) => (info.level === "warn" ? info : false))(),
        format.json(),
      ),
    }),

    // 4.MongoDB
    new transports.MongoDB({
      db: process.env.MONGO_URI,
      level: "info",
      collection: "logs",
      format: format.combine(onlyLowLevelFilter(), format.json()),
    }),
  ],
});

module.exports = logger;

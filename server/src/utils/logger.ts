import pino from "pino";
import dayjs from "dayjs";

// Define the logger with transport for pretty printing
const log = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }, // You can include more pino-pretty options here
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;

import log4js from 'log4js';

log4js.configure({
  appenders: {
    auth: { type: 'console' },
    users: { type: 'console' },
    default: { type: 'console' },
    db: { type: 'console' },
    app: { type: 'console' },
    file: { type: 'file', filename: 'application.log' },
  },
  categories: {
    default: {
      appenders: ['default'],
      level: 'error',
    },
    app: {
      appenders: ['app'],
      level: 'trace',
    },
  },
});

const logger = (message: string, level = 'debug', module = 'default'): void => {
  const logger: any = log4js.getLogger(module);
  logger.level = level;
  logger[level](message);
};

export default logger;

// Logger levels: trace - debug - info - warn - error - fatal
// Logger modules (appenders): auth - users - default - db - app

// logger("log", "error", "app");
// logger("log", "trace", "auth");
// logger("log", "debug", "author");
// logger("log", "info", "courses");
// logger("log", "warn", "home");
// logger("log ", "error", "users");
// logger("log", "fatal", "default");
// logger("log", "error", "file");

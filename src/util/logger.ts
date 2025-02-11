import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

//ref : https://pypystory.tistory.com/80

const isProduction = process.env.NODE_ENV == 'production';

const dailyOptions = (level: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `logs/app`,
        filename: `%DATE%.${level}.log`,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    };
};

/*
# level     - Logger function
  error: 0, - Logger.error()
  warn: 1,  - Logger.warn()
  info: 2,  - Logger.log() ** careful with this level*
  http: 3,  -  Not used
  verbose: 4, - Logger.verbose()
  debug: 5,   - Logger.debug()
  silly: 6
};
*/

const logFormat = winston.format.printf((info) => {
    const level = info.level;
    let icon = '';
    switch (level) {
        case 'error':
            icon = '❌';
            break;
        case 'warn':
            icon = '⚠️ ';
            break;
        case 'info':
            icon = '🟢';
            break;
        case 'http':
        case 'verbose':
        case 'debug':
            icon = '🛠️ ';
            break;
        default:
    }

    return `${icon} [${info.label}] ${info.timestamp} [${info.level}] : ${info.message}`;
});

export const serverLogger: winston.Logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.label({ label: 'next.js-server' }),
        winston.format.splat(), //String interpolation splat for %d %s %O -style messages. you can log object by using %O
    ),
    transports: [
        new winston.transports.Console({
            level: isProduction ? 'info' : 'debug',
            format: winston.format.combine(logFormat),
        }),

        new DailyRotateFile(dailyOptions('info')),
    ],

    exceptionHandlers: [new DailyRotateFile(dailyOptions('exception'))],
});

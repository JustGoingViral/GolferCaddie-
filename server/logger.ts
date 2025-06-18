
import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';

// Log levels
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Logger class for handling all logging operations
class Logger {
  private static instance: Logger;
  private logFilePath: string;
  private errorFilePath: string;

  private constructor() {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    this.logFilePath = path.join(logsDir, `application-${currentDate}.log`);
    this.errorFilePath = path.join(logsDir, `error-${currentDate}.log`);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    let formattedMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (context) {
      const contextStr = typeof context === 'object' ? JSON.stringify(context) : context;
      formattedMessage += ` - Context: ${contextStr}`;
    }
    
    return formattedMessage;
  }

  private writeToFile(filePath: string, message: string): void {
    try {
      fs.appendFileSync(filePath, message + '\n');
    } catch (err) {
      console.error(`Failed to write to log file: ${err}`);
    }
  }

  public debug(message: string, context?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, context);
    console.log(`${colors.blue}${formattedMessage}${colors.reset}`);
    this.writeToFile(this.logFilePath, formattedMessage);
  }

  public info(message: string, context?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, context);
    console.log(`${colors.green}${formattedMessage}${colors.reset}`);
    this.writeToFile(this.logFilePath, formattedMessage);
  }

  public warn(message: string, context?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, context);
    console.log(`${colors.yellow}${formattedMessage}${colors.reset}`);
    this.writeToFile(this.logFilePath, formattedMessage);
  }

  public error(message: string, context?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, context);
    console.error(`${colors.red}${formattedMessage}${colors.reset}`);
    this.writeToFile(this.logFilePath, formattedMessage);
    this.writeToFile(this.errorFilePath, formattedMessage);
  }

  public fatal(message: string, context?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.FATAL, message, context);
    console.error(`${colors.magenta}${formattedMessage}${colors.reset}`);
    this.writeToFile(this.logFilePath, formattedMessage);
    this.writeToFile(this.errorFilePath, formattedMessage);
  }

  public logApiRequest(req: any, res: any, duration: number, responseBody?: any): void {
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      responseBody: responseBody || 'none'
    };

    if (res.statusCode >= 400) {
      this.error(`API Request Failed`, logData);
    } else {
      this.info(`API Request`, logData);
    }
  }
}

export const logger = Logger.getInstance();

type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private write(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      switch (level) {
        case 'error':
          console.error(`[${level.toUpperCase()}] ${message}`, data);
          break;
        case 'warn':
          console.warn(`[${level.toUpperCase()}] ${message}`, data);
          break;
        default:
          console.log(`[${level.toUpperCase()}] ${message}`, data);
      }
    }
  }

  log(message: string, data?: unknown) {
    this.write('log', message, data);
  }

  info(message: string, data?: unknown) {
    this.write('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.write('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.write('error', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

import { Injectable, isDevMode } from '@angular/core';
import { LogLevel } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private readonly isDev = isDevMode();

  log(level: LogLevel, context: string, message: string, data?: any) {
    if (!this.isDev && level === LogLevel.Debug) return; // evita debug en prod

    const logMsg = `[${level}] [${context}] ${message}`;
    if (this.isDev) {
      switch (level) {
        case LogLevel.Info:
          console.info(logMsg, data ?? '');
          break;
        case LogLevel.Warn:
          console.warn(logMsg, data ?? '');
          break;
        case LogLevel.Error:
          console.error(logMsg, data ?? '');
          break;
        case LogLevel.Debug:
          console.log(logMsg, data ?? '');
          break;
      }
    } else if (level === LogLevel.Error) {
      // En producción podrías enviarlo al backend
      // this.sendToServer(level, context, message, data);
    }
  }
}

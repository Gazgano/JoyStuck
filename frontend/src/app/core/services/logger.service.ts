/*
Simple logger which enables to flag source of the log.
To be improved: 
- add custom ouput
- add feature to send log to the server in case of issue

Example usage:
 import { Logger } from 'app/core/logger.service';
 const log = new Logger('myFile');
 log.debug('something happened');
*/

import { environment } from 'src/environments/environment';

export enum LogLevel {
  Off = 0,
  Error,
  Warn,
  Info,
  Debug
}

export class Logger {

  static level: LogLevel = environment.production? LogLevel.Warn : LogLevel.Debug;
  
  constructor(private source?: string) { }

  public error(...objects: any[]) {
    this.log(console.error, LogLevel.Error, objects);
  }
  
  public warn(...objects: any[]) {
    this.log(console.warn, LogLevel.Warn, objects);
  }
  
  public info(...objects: any[]) {
    // tslint:disable-next-line: no-console
    this.log(console.info, LogLevel.Info, objects);
  }
  
  public debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects);
  }
  
  private log(func: (...args: any[]) => void, level: LogLevel, objects: any[]): void {
    if (Logger.level >= level) { // we print messages of the level and also more serious
      let output: any[];
      if (this.source) {
        output = ['[' + this.source + ']'].concat(objects); // if provided, we flag the source at the beginning
      } else {
        output = objects;
      }

      func(...output);
    }
  }
}

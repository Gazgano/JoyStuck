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

import * as moment from 'moment';
import { throwError, EMPTY } from 'rxjs';

import { environment } from 'src/environments/environment';

export enum LogLevel {
  Off = 0,
  Error,
  Warn,
  Info,
  Debug
}

interface LoggerConfig {
  readonly level: LogLevel;
  readonly includeTimestamp: boolean;
}

const GLOBAL_CONFIG: { [key: string]: LoggerConfig; } = {
  production: {
    level: LogLevel.Warn,
    includeTimestamp: true
  },
  dev: {
    level: LogLevel.Debug,
    includeTimestamp: false
  }
};

export class Logger {
  private config = environment.production? GLOBAL_CONFIG.production : GLOBAL_CONFIG.dev;

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

  public handleError(err: any) {
    this.error(err);
    return EMPTY;
  }

  private log(func: (...args: any[]) => void, level: LogLevel, objects: any[]): void {
    if (this.config.level >= level) { // we print messages of the level and also more serious ones as well
      let output: any[] = [];

      if (this.config.includeTimestamp) {
        output = [moment().format('YYYYMMDD HH:mm:ss.SSS')];
      }

      // if provided, we flag the source
      if (this.source) {
        output = output.concat(['[' + this.source + ']']);
      }

      output = output.concat(objects);
      func(...output);
    }
  }
}

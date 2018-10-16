import { HttpHeaders } from '@angular/common/http';
import { NGXLoggerHttpService } from './http.service';
import { LoggerConfig } from './logger.config';
import { NGXLoggerMonitor } from './logger-monitor';
export declare const Levels: string[];
export declare class NGXLogger {
    private readonly httpService;
    private readonly platformId;
    private readonly _isIE;
    private readonly _logFunc;
    private configService;
    private _customHttpHeaders;
    private _loggerMonitor;
    constructor(httpService: NGXLoggerHttpService, loggerConfig: LoggerConfig, platformId: any);
    trace(message: any, ...additional: any[]): void;
    debug(message: any, ...additional: any[]): void;
    info(message: any, ...additional: any[]): void;
    log(message: any, ...additional: any[]): void;
    warn(message: any, ...additional: any[]): void;
    error(message: any, ...additional: any[]): void;
    setCustomHttpHeaders(headers: HttpHeaders): void;
    registerMonitor(monitor: NGXLoggerMonitor): void;
    updateConfig(config: LoggerConfig): void;
    getConfigSnapshot(): LoggerConfig;
    private _logIE(level, metaString, message, additional);
    private _logModern(level, metaString, message, additional);
    private _log(level, message, additional?, logOnServer?);
}

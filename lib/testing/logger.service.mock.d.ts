import { HttpHeaders } from '@angular/common/http';
import { NGXLoggerMonitor } from '../logger-monitor';
import { LoggerConfig } from '../logger.config';
export declare class NGXLoggerMock {
    constructor();
    trace(message: any, ...additional: any[]): void;
    debug(message: any, ...additional: any[]): void;
    info(message: any, ...additional: any[]): void;
    log(message: any, ...additional: any[]): void;
    warn(message: any, ...additional: any[]): void;
    error(message: any, ...additional: any[]): void;
    updateConfig(config: any): void;
    setCustomHttpHeaders(headers: HttpHeaders): void;
    registerMonitor(monitor: NGXLoggerMonitor): void;
    getConfigSnapshot(): LoggerConfig;
}

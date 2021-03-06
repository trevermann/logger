import { LoggerConfig } from './logger.config';
export declare class NGXLoggerConfigEngine {
    readonly config: LoggerConfig;
    private _config;
    constructor(config: LoggerConfig);
    updateConfig(config: LoggerConfig): void;
    getConfig(): LoggerConfig;
    private _clone(object);
}

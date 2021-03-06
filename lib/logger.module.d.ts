import { ModuleWithProviders } from '@angular/core';
import { LoggerConfig } from './logger.config';
export * from './logger.service';
export * from './logger.config';
export * from './custom-logger.service';
export * from './logger-monitor';
export * from './http.service';
export * from './utils/logger.utils';
export * from './types/logger-level.enum';
export * from './types/ngx-log.interface';
export declare class LoggerModule {
    static forRoot(config: LoggerConfig | null | undefined): ModuleWithProviders;
    static forChild(): ModuleWithProviders;
}

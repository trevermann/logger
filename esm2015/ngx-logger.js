import { Injectable, Inject, PLATFORM_ID, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { of } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NGXLoggerHttpService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?} log
     * @param {?} customHeaders
     * @return {?}
     */
    logOnServer(url, log, customHeaders) {
        /** @type {?} */
        const headers = customHeaders || new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        /** @type {?} */
        const options = {
            headers: headers
        };
        return this.http.post(url, log, options);
    }
}
NGXLoggerHttpService.decorators = [
    { type: Injectable },
];
NGXLoggerHttpService.ctorParameters = () => [
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const NgxLoggerLevel = {
    TRACE: 0, DEBUG: 1, INFO: 2, LOG: 3, WARN: 4, ERROR: 5, OFF: 6,
};
NgxLoggerLevel[NgxLoggerLevel.TRACE] = 'TRACE';
NgxLoggerLevel[NgxLoggerLevel.DEBUG] = 'DEBUG';
NgxLoggerLevel[NgxLoggerLevel.INFO] = 'INFO';
NgxLoggerLevel[NgxLoggerLevel.LOG] = 'LOG';
NgxLoggerLevel[NgxLoggerLevel.WARN] = 'WARN';
NgxLoggerLevel[NgxLoggerLevel.ERROR] = 'ERROR';
NgxLoggerLevel[NgxLoggerLevel.OFF] = 'OFF';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LoggerConfig {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NGXLoggerConfigEngine {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.config = config;
        this._config = config;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    updateConfig(config) {
        this._config = this._clone(config);
    }
    /**
     * @return {?}
     */
    getConfig() {
        return this._clone(this._config);
    }
    // TODO: add tests around cloning the config. updating an object passed into the config (or retrieving from the config)
    // should not update the active config
    /**
     * @param {?} object
     * @return {?}
     */
    _clone(object) {
        /** @type {?} */
        const cloneConfig = new LoggerConfig();
        Object.keys(object).forEach((key) => {
            cloneConfig[key] = object[key];
        });
        return cloneConfig;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NGXLoggerUtils {
    /**
     * @param {?} timestamp
     * @param {?} logLevel
     * @param {?} fileName
     * @param {?} lineNumber
     * @return {?}
     */
    static prepareMetaString(timestamp, logLevel, fileName, lineNumber) {
        /** @type {?} */
        const fileDetails = fileName ? ` [${fileName}:${lineNumber}]` : '';
        return `${timestamp} ${logLevel}${fileDetails}`;
    }
    /**
     * @param {?} level
     * @return {?}
     */
    static getColor(level) {
        switch (level) {
            case NgxLoggerLevel.TRACE:
                return 'blue';
            case NgxLoggerLevel.DEBUG:
                return 'teal';
            case NgxLoggerLevel.INFO:
            case NgxLoggerLevel.LOG:
                return 'gray';
            case NgxLoggerLevel.WARN:
            case NgxLoggerLevel.ERROR:
                return 'red';
            case NgxLoggerLevel.OFF:
            default:
                return;
        }
    }
    /**
     *  This allows us to see who called the logger
     * @return {?}
     */
    static getCallerDetails() {
        /** @type {?} */
        const err = (new Error(''));
        try {
            // this should produce the line which NGX Logger was called
            /** @type {?} */
            const callerLine = err.stack.split('\n')[4].split('/');
            // returns the file:lineNumber
            /** @type {?} */
            const fileLineNumber = callerLine[callerLine.length - 1].replace(/[)]/g, '').split(':');
            return {
                fileName: fileLineNumber[0],
                lineNumber: fileLineNumber[1]
            };
        }
        catch (e) {
            return {
                fileName: null,
                lineNumber: null
            };
        }
    }
    /**
     * @param {?} message
     * @return {?}
     */
    static prepareMessage(message) {
        try {
            if (typeof message !== 'string' && !(message instanceof Error)) {
                message = JSON.stringify(message, null, 2);
            }
        }
        catch (e) {
            // additional = [message, ...additional];
            message = 'The provided "message" value could not be parsed with JSON.stringify().';
        }
        return message;
    }
    /**
     * @param {?} additional
     * @return {?}
     */
    static prepareAdditionalParameters(additional) {
        if (additional === null || additional === undefined) {
            return null;
        }
        return additional.map((next, idx) => {
            try {
                // We just want to make sure the JSON can be parsed, we do not want to actually change the type
                if (typeof next === 'object') {
                    JSON.stringify(next);
                }
                return next;
            }
            catch (e) {
                return `The additional[${idx}] value could not be parsed using JSON.stringify().`;
            }
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const Levels = [
    'TRACE',
    'DEBUG',
    'INFO',
    'LOG',
    'WARN',
    'ERROR',
    'OFF'
];
class NGXLogger {
    /**
     * @param {?} httpService
     * @param {?} loggerConfig
     * @param {?} platformId
     */
    constructor(httpService, loggerConfig, platformId) {
        this.httpService = httpService;
        this.platformId = platformId;
        this._isIE = isPlatformBrowser(platformId) &&
            !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));
        // each instance of the logger should have their own config engine
        this.configService = new NGXLoggerConfigEngine(loggerConfig);
        this._logFunc = this._isIE ? this._logIE.bind(this) : this._logModern.bind(this);
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    trace(message, ...additional) {
        this._log(NgxLoggerLevel.TRACE, message, additional);
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    debug(message, ...additional) {
        this._log(NgxLoggerLevel.DEBUG, message, additional);
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    info(message, ...additional) {
        this._log(NgxLoggerLevel.INFO, message, additional);
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    log(message, ...additional) {
        this._log(NgxLoggerLevel.LOG, message, additional);
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    warn(message, ...additional) {
        this._log(NgxLoggerLevel.WARN, message, additional);
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    error(message, ...additional) {
        this._log(NgxLoggerLevel.ERROR, message, additional);
    }
    /**
     * @param {?} headers
     * @return {?}
     */
    setCustomHttpHeaders(headers) {
        this._customHttpHeaders = headers;
    }
    /**
     * @param {?} monitor
     * @return {?}
     */
    registerMonitor(monitor) {
        this._loggerMonitor = monitor;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    updateConfig(config) {
        this.configService.updateConfig(config);
    }
    /**
     * @return {?}
     */
    getConfigSnapshot() {
        return this.configService.getConfig();
    }
    /**
     * @param {?} level
     * @param {?} metaString
     * @param {?} message
     * @param {?} additional
     * @return {?}
     */
    _logIE(level, metaString, message, additional) {
        // Coloring doesn't work in IE
        // make sure additional isn't null or undefined so that ...additional doesn't error
        additional = additional || [];
        switch (level) {
            case NgxLoggerLevel.WARN:
                console.warn(`${metaString} `, message, ...additional);
                break;
            case NgxLoggerLevel.ERROR:
                console.error(`${metaString} `, message, ...additional);
                break;
            case NgxLoggerLevel.INFO:
                console.info(`${metaString} `, message, ...additional);
                break;
            default:
                console.log(`${metaString} `, message, ...additional);
        }
    }
    /**
     * @param {?} level
     * @param {?} metaString
     * @param {?} message
     * @param {?} additional
     * @return {?}
     */
    _logModern(level, metaString, message, additional) {
        /** @type {?} */
        const color = NGXLoggerUtils.getColor(level);
        // make sure additional isn't null or undefined so that ...additional doesn't error
        additional = additional || [];
        switch (level) {
            case NgxLoggerLevel.WARN:
                console.warn(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            case NgxLoggerLevel.ERROR:
                console.error(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            case NgxLoggerLevel.INFO:
                console.info(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            case NgxLoggerLevel.TRACE:
                console.trace(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            //  Disabling console.debug, because Has this hidden by default.
            // case NgxLoggerLevel.DEBUG:
            //   console.debug(`%c${metaString}`, `color:${color}`, message, ...additional);
            //   break;
            default:
                console.log(`%c${metaString}`, `color:${color}`, message, ...additional);
        }
    }
    /**
     * @param {?} level
     * @param {?} message
     * @param {?=} additional
     * @param {?=} logOnServer
     * @return {?}
     */
    _log(level, message, additional = [], logOnServer = true) {
        /** @type {?} */
        const config = this.configService.getConfig();
        /** @type {?} */
        const isLog2Server = logOnServer && config.serverLoggingUrl && level >= config.serverLogLevel;
        /** @type {?} */
        const isLog2Console = !(level < config.level);
        if (!(message && (isLog2Server || isLog2Console))) {
            return;
        }
        /** @type {?} */
        const logLevelString = Levels[level];
        message = NGXLoggerUtils.prepareMessage(message);
        // only use validated parameters for HTTP requests
        /** @type {?} */
        const validatedAdditionalParameters = NGXLoggerUtils.prepareAdditionalParameters(additional);
        /** @type {?} */
        const timestamp = new Date().toString();
        /** @type {?} */
        const callerDetails = NGXLoggerUtils.getCallerDetails();
        /** @type {?} */
        const logObject = {
            message: message,
            additional: validatedAdditionalParameters,
            level: level,
            timestamp: timestamp,
            fileName: callerDetails.fileName,
            lineNumber: callerDetails.lineNumber
        };
        if (this._loggerMonitor) {
            this._loggerMonitor.onLog(logObject);
        }
        if (isLog2Server) {
            // make sure the stack gets sent to the server
            message = message instanceof Error ? message.stack : message;
            logObject.message = message;
            // Allow logging on server even if client log level is off
            this.httpService.logOnServer(config.serverLoggingUrl, logObject, this._customHttpHeaders).subscribe((res) => {
                // I don't think we should do anything on success
            }, (error) => {
                this._log(NgxLoggerLevel.ERROR, `FAILED TO LOG ON SERVER: ${message}`, [error], false);
            });
        }
        // if no message or the log level is less than the environ
        if (isLog2Console) {
            /** @type {?} */
            const metaString = NGXLoggerUtils.prepareMetaString(timestamp, logLevelString, callerDetails.fileName, callerDetails.lineNumber);
            return this._logFunc(level, metaString, message, additional);
        }
    }
}
NGXLogger.decorators = [
    { type: Injectable },
];
NGXLogger.ctorParameters = () => [
    { type: NGXLoggerHttpService },
    { type: LoggerConfig },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CustomNGXLoggerService is designed to allow users to get a new instance of a logger
 */
class CustomNGXLoggerService {
    /**
     * @param {?} httpService
     * @param {?} platformId
     */
    constructor(httpService, platformId) {
        this.httpService = httpService;
        this.platformId = platformId;
    }
    /**
     * @param {?} config
     * @param {?=} httpService
     * @param {?=} logMonitor
     * @return {?}
     */
    create(config, httpService, logMonitor) {
        // you can inject your own httpService or use the default,
        /** @type {?} */
        const logger = new NGXLogger(httpService || this.httpService, config, this.platformId);
        if (logMonitor) {
            logger.registerMonitor(logMonitor);
        }
        return logger;
    }
}
CustomNGXLoggerService.decorators = [
    { type: Injectable },
];
CustomNGXLoggerService.ctorParameters = () => [
    { type: NGXLoggerHttpService },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class NGXLoggerMonitor {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NGXLogInterface {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LoggerModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: LoggerModule,
            providers: [
                { provide: LoggerConfig, useValue: config || {} },
                NGXLogger,
                NGXLoggerHttpService,
                CustomNGXLoggerService
            ]
        };
    }
    /**
     * @return {?}
     */
    static forChild() {
        return {
            ngModule: LoggerModule,
            providers: [
                NGXLogger,
                NGXLoggerHttpService,
                CustomNGXLoggerService
            ]
        };
    }
}
LoggerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    HttpClientModule
                ],
                providers: [
                    NGXLogger,
                    NGXLoggerHttpService,
                    CustomNGXLoggerService
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NGXLoggerMock {
    constructor() {
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    trace(message, ...additional) {
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    debug(message, ...additional) {
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    info(message, ...additional) {
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    log(message, ...additional) {
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    warn(message, ...additional) {
    }
    /**
     * @param {?} message
     * @param {...?} additional
     * @return {?}
     */
    error(message, ...additional) {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    updateConfig(config) {
    }
    /**
     * @param {?} headers
     * @return {?}
     */
    setCustomHttpHeaders(headers) {
    }
    /**
     * @param {?} monitor
     * @return {?}
     */
    registerMonitor(monitor) {
    }
    /**
     * @return {?}
     */
    getConfigSnapshot() {
        return new LoggerConfig();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CustomNGXLoggerServiceMock is a mock for CustomNGXLoggerService
 */
class CustomNGXLoggerServiceMock {
    constructor() {
    }
    /**
     * @return {?}
     */
    create() {
        // you can inject your own httpService or use the default,
        return new NGXLoggerMock();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NGXLoggerHttpServiceMock {
    constructor() {
    }
    /**
     * @param {?} url
     * @param {?} message
     * @param {?} additional
     * @param {?} timestamp
     * @param {?} logLevel
     * @return {?}
     */
    logOnServer(url, message, additional, timestamp, logLevel) {
        return of({});
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LoggerTestingModule {
}
LoggerTestingModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    { provide: NGXLogger, useClass: NGXLoggerMock },
                    { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
                    { provide: CustomNGXLoggerService, useClass: CustomNGXLoggerServiceMock },
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/*
 * Public API Surface of ngx-logger
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { LoggerModule, Levels, NGXLogger, LoggerConfig, CustomNGXLoggerService, NGXLoggerMonitor, NGXLoggerHttpService, NGXLoggerUtils, NgxLoggerLevel, NGXLogInterface, NGXLoggerMock, CustomNGXLoggerServiceMock, NGXLoggerHttpServiceMock, LoggerTestingModule };
//# sourceMappingURL=ngx-logger.js.map

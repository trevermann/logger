import { __spread } from 'tslib';
import { Injectable, Inject, PLATFORM_ID, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { of } from 'rxjs';

var NGXLoggerHttpService = /** @class */ (function () {
    function NGXLoggerHttpService(http) {
        this.http = http;
    }
    NGXLoggerHttpService.prototype.logOnServer = function (url, log, customHeaders) {
        var headers = customHeaders || new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        return this.http.post(url, log, options);
    };
    return NGXLoggerHttpService;
}());
NGXLoggerHttpService.decorators = [
    { type: Injectable },
];
NGXLoggerHttpService.ctorParameters = function () { return [
    { type: HttpClient }
]; };
var NgxLoggerLevel = {
    TRACE: 0, DEBUG: 1, INFO: 2, LOG: 3, WARN: 4, ERROR: 5, OFF: 6,
};
NgxLoggerLevel[NgxLoggerLevel.TRACE] = 'TRACE';
NgxLoggerLevel[NgxLoggerLevel.DEBUG] = 'DEBUG';
NgxLoggerLevel[NgxLoggerLevel.INFO] = 'INFO';
NgxLoggerLevel[NgxLoggerLevel.LOG] = 'LOG';
NgxLoggerLevel[NgxLoggerLevel.WARN] = 'WARN';
NgxLoggerLevel[NgxLoggerLevel.ERROR] = 'ERROR';
NgxLoggerLevel[NgxLoggerLevel.OFF] = 'OFF';
var LoggerConfig = /** @class */ (function () {
    function LoggerConfig() {
    }
    return LoggerConfig;
}());
var NGXLoggerConfigEngine = /** @class */ (function () {
    function NGXLoggerConfigEngine(config) {
        this.config = config;
        this._config = config;
    }
    NGXLoggerConfigEngine.prototype.updateConfig = function (config) {
        this._config = this._clone(config);
    };
    NGXLoggerConfigEngine.prototype.getConfig = function () {
        return this._clone(this._config);
    };
    NGXLoggerConfigEngine.prototype._clone = function (object) {
        var cloneConfig = new LoggerConfig();
        Object.keys(object).forEach(function (key) {
            cloneConfig[key] = object[key];
        });
        return cloneConfig;
    };
    return NGXLoggerConfigEngine;
}());
var NGXLoggerUtils = /** @class */ (function () {
    function NGXLoggerUtils() {
    }
    NGXLoggerUtils.prepareMetaString = function (timestamp, logLevel, fileName, lineNumber) {
        var fileDetails = fileName ? " [" + fileName + ":" + lineNumber + "]" : '';
        return timestamp + " " + logLevel + fileDetails;
    };
    NGXLoggerUtils.getColor = function (level) {
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
    };
    NGXLoggerUtils.getCallerDetails = function () {
        var err = (new Error(''));
        try {
            var callerLine = err.stack.split('\n')[4].split('/');
            var fileLineNumber = callerLine[callerLine.length - 1].replace(/[)]/g, '').split(':');
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
    };
    NGXLoggerUtils.prepareMessage = function (message) {
        try {
            if (typeof message !== 'string' && !(message instanceof Error)) {
                message = JSON.stringify(message, null, 2);
            }
        }
        catch (e) {
            message = 'The provided "message" value could not be parsed with JSON.stringify().';
        }
        return message;
    };
    NGXLoggerUtils.prepareAdditionalParameters = function (additional) {
        if (additional === null || additional === undefined) {
            return null;
        }
        return additional.map(function (next, idx) {
            try {
                if (typeof next === 'object') {
                    JSON.stringify(next);
                }
                return next;
            }
            catch (e) {
                return "The additional[" + idx + "] value could not be parsed using JSON.stringify().";
            }
        });
    };
    return NGXLoggerUtils;
}());
var Levels = [
    'TRACE',
    'DEBUG',
    'INFO',
    'LOG',
    'WARN',
    'ERROR',
    'OFF'
];
var NGXLogger = /** @class */ (function () {
    function NGXLogger(httpService, loggerConfig, platformId) {
        this.httpService = httpService;
        this.platformId = platformId;
        this._isIE = isPlatformBrowser(platformId) &&
            !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));
        this.configService = new NGXLoggerConfigEngine(loggerConfig);
        this._logFunc = this._isIE ? this._logIE.bind(this) : this._logModern.bind(this);
    }
    NGXLogger.prototype.trace = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
        this._log(NgxLoggerLevel.TRACE, message, additional);
    };
    NGXLogger.prototype.debug = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
        this._log(NgxLoggerLevel.DEBUG, message, additional);
    };
    NGXLogger.prototype.info = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
        this._log(NgxLoggerLevel.INFO, message, additional);
    };
    NGXLogger.prototype.log = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
        this._log(NgxLoggerLevel.LOG, message, additional);
    };
    NGXLogger.prototype.warn = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
        this._log(NgxLoggerLevel.WARN, message, additional);
    };
    NGXLogger.prototype.error = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
        this._log(NgxLoggerLevel.ERROR, message, additional);
    };
    NGXLogger.prototype.setCustomHttpHeaders = function (headers) {
        this._customHttpHeaders = headers;
    };
    NGXLogger.prototype.registerMonitor = function (monitor) {
        this._loggerMonitor = monitor;
    };
    NGXLogger.prototype.updateConfig = function (config) {
        this.configService.updateConfig(config);
    };
    NGXLogger.prototype.getConfigSnapshot = function () {
        return this.configService.getConfig();
    };
    NGXLogger.prototype._logIE = function (level, metaString, message, additional) {
        additional = additional || [];
        switch (level) {
            case NgxLoggerLevel.WARN:
                console.warn.apply(console, __spread([metaString + " ", message], additional));
                break;
            case NgxLoggerLevel.ERROR:
                console.error.apply(console, __spread([metaString + " ", message], additional));
                break;
            case NgxLoggerLevel.INFO:
                console.info.apply(console, __spread([metaString + " ", message], additional));
                break;
            default:
                console.log.apply(console, __spread([metaString + " ", message], additional));
        }
    };
    NGXLogger.prototype._logModern = function (level, metaString, message, additional) {
        var color = NGXLoggerUtils.getColor(level);
        additional = additional || [];
        switch (level) {
            case NgxLoggerLevel.WARN:
                console.warn.apply(console, __spread(["%c" + metaString, "color:" + color, message], additional));
                break;
            case NgxLoggerLevel.ERROR:
                console.error.apply(console, __spread(["%c" + metaString, "color:" + color, message], additional));
                break;
            case NgxLoggerLevel.INFO:
                console.info.apply(console, __spread(["%c" + metaString, "color:" + color, message], additional));
                break;
            case NgxLoggerLevel.TRACE:
                console.trace.apply(console, __spread(["%c" + metaString, "color:" + color, message], additional));
                break;
            default:
                console.log.apply(console, __spread(["%c" + metaString, "color:" + color, message], additional));
        }
    };
    NGXLogger.prototype._log = function (level, message, additional, logOnServer) {
        var _this = this;
        if (additional === void 0) { additional = []; }
        if (logOnServer === void 0) { logOnServer = true; }
        var config = this.configService.getConfig();
        var isLog2Server = logOnServer && config.serverLoggingUrl && level >= config.serverLogLevel;
        var isLog2Console = !(level < config.level);
        if (!(message && (isLog2Server || isLog2Console))) {
            return;
        }
        var logLevelString = Levels[level];
        message = NGXLoggerUtils.prepareMessage(message);
        var validatedAdditionalParameters = NGXLoggerUtils.prepareAdditionalParameters(additional);
        var timestamp = new Date().toString();
        var callerDetails = NGXLoggerUtils.getCallerDetails();
        var logObject = {
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
            message = message instanceof Error ? message.stack : message;
            logObject.message = message;
            this.httpService.logOnServer(config.serverLoggingUrl, logObject, this._customHttpHeaders).subscribe(function (res) {
            }, function (error) {
                _this._log(NgxLoggerLevel.ERROR, "FAILED TO LOG ON SERVER: " + message, [error], false);
            });
        }
        if (isLog2Console) {
            var metaString = NGXLoggerUtils.prepareMetaString(timestamp, logLevelString, callerDetails.fileName, callerDetails.lineNumber);
            return this._logFunc(level, metaString, message, additional);
        }
    };
    return NGXLogger;
}());
NGXLogger.decorators = [
    { type: Injectable },
];
NGXLogger.ctorParameters = function () { return [
    { type: NGXLoggerHttpService },
    { type: LoggerConfig },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
]; };
var CustomNGXLoggerService = /** @class */ (function () {
    function CustomNGXLoggerService(httpService, platformId) {
        this.httpService = httpService;
        this.platformId = platformId;
    }
    CustomNGXLoggerService.prototype.create = function (config, httpService, logMonitor) {
        var logger = new NGXLogger(httpService || this.httpService, config, this.platformId);
        if (logMonitor) {
            logger.registerMonitor(logMonitor);
        }
        return logger;
    };
    return CustomNGXLoggerService;
}());
CustomNGXLoggerService.decorators = [
    { type: Injectable },
];
CustomNGXLoggerService.ctorParameters = function () { return [
    { type: NGXLoggerHttpService },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
]; };
var NGXLoggerMonitor = /** @class */ (function () {
    function NGXLoggerMonitor() {
    }
    return NGXLoggerMonitor;
}());
var NGXLogInterface = /** @class */ (function () {
    function NGXLogInterface() {
    }
    return NGXLogInterface;
}());
var LoggerModule = /** @class */ (function () {
    function LoggerModule() {
    }
    LoggerModule.forRoot = function (config) {
        return {
            ngModule: LoggerModule,
            providers: [
                { provide: LoggerConfig, useValue: config || {} },
                NGXLogger,
                NGXLoggerHttpService,
                CustomNGXLoggerService
            ]
        };
    };
    LoggerModule.forChild = function () {
        return {
            ngModule: LoggerModule,
            providers: [
                NGXLogger,
                NGXLoggerHttpService,
                CustomNGXLoggerService
            ]
        };
    };
    return LoggerModule;
}());
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
var NGXLoggerMock = /** @class */ (function () {
    function NGXLoggerMock() {
    }
    NGXLoggerMock.prototype.trace = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
    };
    NGXLoggerMock.prototype.debug = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
    };
    NGXLoggerMock.prototype.info = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
    };
    NGXLoggerMock.prototype.log = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
    };
    NGXLoggerMock.prototype.warn = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
    };
    NGXLoggerMock.prototype.error = function (message) {
        var additional = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            additional[_i - 1] = arguments[_i];
        }
    };
    NGXLoggerMock.prototype.updateConfig = function (config) {
    };
    NGXLoggerMock.prototype.setCustomHttpHeaders = function (headers) {
    };
    NGXLoggerMock.prototype.registerMonitor = function (monitor) {
    };
    NGXLoggerMock.prototype.getConfigSnapshot = function () {
        return new LoggerConfig();
    };
    return NGXLoggerMock;
}());
var CustomNGXLoggerServiceMock = /** @class */ (function () {
    function CustomNGXLoggerServiceMock() {
    }
    CustomNGXLoggerServiceMock.prototype.create = function () {
        return new NGXLoggerMock();
    };
    return CustomNGXLoggerServiceMock;
}());
var NGXLoggerHttpServiceMock = /** @class */ (function () {
    function NGXLoggerHttpServiceMock() {
    }
    NGXLoggerHttpServiceMock.prototype.logOnServer = function (url, message, additional, timestamp, logLevel) {
        return of({});
    };
    return NGXLoggerHttpServiceMock;
}());
var LoggerTestingModule = /** @class */ (function () {
    function LoggerTestingModule() {
    }
    return LoggerTestingModule;
}());
LoggerTestingModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    { provide: NGXLogger, useClass: NGXLoggerMock },
                    { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
                    { provide: CustomNGXLoggerService, useClass: CustomNGXLoggerServiceMock },
                ]
            },] },
];

export { LoggerModule, Levels, NGXLogger, LoggerConfig, CustomNGXLoggerService, NGXLoggerMonitor, NGXLoggerHttpService, NGXLoggerUtils, NgxLoggerLevel, NGXLogInterface, NGXLoggerMock, CustomNGXLoggerServiceMock, NGXLoggerHttpServiceMock, LoggerTestingModule };
//# sourceMappingURL=ngx-logger.js.map

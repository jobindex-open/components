enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

export type LoggerConfig = {
    name: string;
    minLevel: LogLevel;
};

export const createLogger = (config: Partial<LoggerConfig>) => {
    const name = `PDFjsVue::${config.name ?? 'DefaultLogger'}`;
    const minLevel = config.minLevel ?? LogLevel.Info;

    const logLevelName = (level: LogLevel) => {
        switch (level) {
            case LogLevel.Trace:
                return 'TRACE';
            case LogLevel.Debug:
                return 'DEBUG';
            case LogLevel.Info:
                return 'INFO';
            case LogLevel.Warn:
                return 'WARN';
            case LogLevel.Error:
                return 'ERROR';
            default:
                return 'LOG';
        }
    };

    const getLogFunction = (level: LogLevel) => {
        switch (level) {
            case LogLevel.Trace:
                return console.trace;
            case LogLevel.Debug:
                return console.debug;
            case LogLevel.Info:
                return console.info;
            case LogLevel.Warn:
                return console.warn;
            case LogLevel.Error:
                return console.error;
            default:
                return console.log;
        }
    };

    const formatMessage = (level: LogLevel, message: any) => {
        return `[${logLevelName(level)}] ${name}: ${message}`;
    };

    const log = (
        level: LogLevel,
        message?: any,
        ...optionalParameters: any[]
    ) => {
        if (level < minLevel) return;

        const fn = getLogFunction(level);
        const formattedMessage = formatMessage(level, message);

        fn(formattedMessage, ...optionalParameters);
    };

    const trace = (message?: any, ...optionalParameters: any[]) => {
        log(LogLevel.Trace, message, ...optionalParameters);
    };

    const debug = (message?: any, ...optionalParameters: any[]) => {
        log(LogLevel.Debug, message, ...optionalParameters);
    };

    const info = (message?: any, ...optionalParameters: any[]) => {
        log(LogLevel.Info, message, ...optionalParameters);
    };

    const warn = (message?: any, ...optionalParameters: any[]) => {
        log(LogLevel.Warn, message, ...optionalParameters);
    };

    const error = (message?: any, ...optionalParameters: any[]) => {
        log(LogLevel.Error, message, ...optionalParameters);
    };

    return { trace, debug, info, warn, error };
};

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

export type LoggerConfig = {
    name?: string;
    minLevel: LogLevel;
    silence: boolean;
};

const defaultLoggerConfig: LoggerConfig = {
    name: undefined,
    minLevel: LogLevel.Info,
    silence: false,
};

export const createLogger = (config: Partial<LoggerConfig>) => {
    const _config = {
        ...defaultLoggerConfig,
        ...config,
    };

    const levelNames: Record<LogLevel, string> = {
        [LogLevel.Trace]: 'TRACE',
        [LogLevel.Debug]: 'DEBUG',
        [LogLevel.Info]: 'INFO',
        [LogLevel.Warn]: 'WARN',
        [LogLevel.Error]: 'ERROR',
    };

    const logFunctions: Record<LogLevel, (...args: unknown[]) => void> = {
        [LogLevel.Trace]: console.trace,
        [LogLevel.Debug]: console.debug,
        [LogLevel.Info]: console.info,
        [LogLevel.Warn]: console.warn,
        [LogLevel.Error]: console.error,
    };

    const logLevelName = (level: LogLevel) => levelNames[level] ?? 'LOG';
    const getLogFunction = (level: LogLevel) =>
        logFunctions[level] ?? console.log;

    const formatMessage = (level: LogLevel, message: unknown) => {
        const name = _config.name ? `${_config.name}: ` : '';
        return `[${logLevelName(level)}] ${name}${String(message)}`;
    };

    const log = (
        level: LogLevel,
        message?: unknown,
        ...optionalParameters: unknown[]
    ) => {
        if (_config.silence) return;
        if (level < _config.minLevel) return;

        const formattedMessage = formatMessage(level, message);
        const fn = getLogFunction(level);
        fn(formattedMessage, ...optionalParameters);
    };

    const trace = (message?: unknown, ...optionalParameters: unknown[]) => {
        log(LogLevel.Trace, message, ...optionalParameters);
    };

    const debug = (message?: unknown, ...optionalParameters: unknown[]) => {
        log(LogLevel.Debug, message, ...optionalParameters);
    };

    const info = (message?: unknown, ...optionalParameters: unknown[]) => {
        log(LogLevel.Info, message, ...optionalParameters);
    };

    const warn = (message?: unknown, ...optionalParameters: unknown[]) => {
        log(LogLevel.Warn, message, ...optionalParameters);
    };

    const error = (message?: unknown, ...optionalParameters: unknown[]) => {
        log(LogLevel.Error, message, ...optionalParameters);
    };

    return { trace, debug, info, warn, error };
};

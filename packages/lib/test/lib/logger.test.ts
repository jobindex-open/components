import { describe, expect, vi, beforeEach, test } from 'vitest';
import { createLogger, LogLevel } from '../../src';

describe('Logger', () => {
    const consoleMethods = {
        trace: vi.spyOn(console, 'trace').mockImplementation(() => {}),
        debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
        info: vi.spyOn(console, 'info').mockImplementation(() => {}),
        warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
        error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('logs info and above by default', () => {
        const logger = createLogger({ name: 'Test' });

        logger.trace('trace');
        logger.debug('debug');
        logger.info('info');
        logger.warn('warn');
        logger.error('error');

        expect(consoleMethods.trace).not.toHaveBeenCalled();
        expect(consoleMethods.debug).not.toHaveBeenCalled();
        expect(consoleMethods.info).toHaveBeenCalledWith(
            expect.stringContaining('[INFO]')
        );
        expect(consoleMethods.warn).toHaveBeenCalledWith(
            expect.stringContaining('[WARN]')
        );
        expect(consoleMethods.error).toHaveBeenCalledWith(
            expect.stringContaining('[ERROR]')
        );
    });

    test('respects custom minLevel', () => {
        const logger = createLogger({ name: 'Test', minLevel: LogLevel.Debug });

        logger.trace('trace');
        logger.debug('debug');

        expect(consoleMethods.trace).not.toHaveBeenCalled();
        expect(consoleMethods.debug).toHaveBeenCalledWith(
            expect.stringContaining('[DEBUG]')
        );
    });

    test('formats messages with logger name', () => {
        const logger = createLogger({ name: 'MyLogger' });
        logger.info('hello');

        expect(consoleMethods.info).toHaveBeenCalledWith(
            '[INFO] MyLogger: hello'
        );
    });

    test('uses default logger name if none provided', () => {
        const logger = createLogger({});
        logger.warn('warn');

        expect(consoleMethods.warn).toHaveBeenCalledWith('[WARN] warn');
    });

    test('handles optional parameters', () => {
        const logger = createLogger({});
        logger.error('error', { code: 500 });

        expect(consoleMethods.error).toHaveBeenCalledWith(
            expect.stringContaining('[ERROR]'),
            { code: 500 }
        );
    });
});

import { describe, expect, test } from 'vitest';
import * as s from '../../../src/lib/util/serialization';

describe('Serialization utils', () => {
    test.each([
        ['hello', '\n', 'hello'],
        [1, '\n', '1'],
        [{ hello: 'world' }, '\n', 'hello,world'],
        [{ key1: 'value1', key2: 'value2' }, '\n', 'key1,value1\nkey2,value2'],
        [
            { key1: { nestedKey1: 'nested value 1' }, key2: 'value 2' },
            '\n',
            'key1,nestedKey1,nested value 1\nkey2,value 2',
        ],
        [
            { key1: { nestedKey1: 'nested value 1' }, key2: 'value 2' },
            ':',
            'key1,nestedKey1,nested value 1:key2,value 2',
        ],
        [
            {
                key1: {
                    nestedKey1: 'nested value 1',
                    nestedKey2: 'nested value 2',
                },
                key2: 'value 2',
            },
            '\n',
            'key1,nestedKey1,nested value 1\nnestedKey2,nested value 2\nkey2,value 2',
        ],
    ])('serialize(%o, %o) -> %o', (val, sepparator, expected) => {
        expect(s.serialize(val, sepparator)).toEqual(expected);
    });

    test.each([
        [
            new Request('http:192.168.0.10:8080'),
            '\n',
            'method:GET\nurl:http://192.168.0.10:8080/',
        ],
        [
            new Request('http:192.168.0.10:8080'),
            '|',
            'method:GET|url:http://192.168.0.10:8080/',
        ],
        [
            new Request('http:192.168.0.10:8080/test', {
                method: 'GET',
                headers: {
                    hello: 'world',
                },
            }),
            '\n',
            'method:GET\nurl:http://192.168.0.10:8080/test\nheaders:hello,world',
        ],
        [
            new Request('http:192.168.0.10:8080/test', {
                method: 'GET',
                headers: {
                    hello: 'world',
                },
            }),
            '|',
            'method:GET|url:http://192.168.0.10:8080/test|headers:hello,world',
        ],
        [
            new Request(
                'http:192.168.0.10:8080/test?test=hello&another=greetings'
            ),
            '\n',
            'method:GET\nurl:http://192.168.0.10:8080/test?test=hello&another=greetings',
        ],
    ])('serializeRequest(%o, %o) -> %o', (val, sepparator, expected) => {
        expect(s.serializeRequest(val, sepparator)).toEqual(expected);
    });
});

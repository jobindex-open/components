/**
 * Serialize an object to a string
 */
export const serialize = (value: unknown, sepparator: string = '\n') => {
    return value && typeof value === 'object'
        ? Object.entries(value)
              .map(([idx, val]): any => [idx, serialize(val)])
              .sort()
              .join(sepparator)
        : String(value);
};

/**
 * Serialize a `Request` object
 *
 * @TODO Currently only supports GET requests, since the body is
 *       not being serialized
 */
export const serializeRequest = (
    request: Request,
    sepparator: string = '\n'
) => {
    const method = `method:${request.method}`;
    const url = `url:${request.url}`;

    const headersObj = Object.fromEntries(request.headers.entries());
    const headersLength = Object.keys(headersObj).length;
    const headers = headersLength
        ? `headers:${serialize(headersObj)}`
        : undefined;

    return [method, url, headers].filter(Boolean).join(sepparator);
};

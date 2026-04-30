export type Size = { width: number; height: number };

export type TimerHandle = ReturnType<typeof setTimeout> | undefined;

export type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type HTTP_GET = 'GET';
export type HTTP_POST = 'POST';
export type HTTP_PUT = 'PUT';
export type HTTP_DELETE = 'DELETE';
export type HTTP_CONNECT = 'CONNECT';
export type HTTP_OPTIONS = 'OPTIONS';
export type HTTP_TRACE = 'TRACE';
export type HTTP_PATCH = 'PATCH';
export type HTTP_HEAD = 'HEAD';

export type HTTPMethod =
    | HTTP_GET
    | HTTP_POST
    | HTTP_PUT
    | HTTP_DELETE
    | HTTP_CONNECT
    | HTTP_OPTIONS
    | HTTP_TRACE
    | HTTP_PATCH
    | HTTP_HEAD;

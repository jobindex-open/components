export type Size = { width: number; height: number };

export type TimerHandle = ReturnType<typeof setTimeout> | undefined;

export type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

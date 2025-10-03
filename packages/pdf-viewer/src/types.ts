export type Size = { width: number; height: number };

export type TimerHandle = ReturnType<typeof setTimeout> | undefined;

export type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ScaleMode = 'auto' | 'fit-width' | 'fit-height' | 'absolute';
export type ScaleOption =
    | {
          mode: Exclude<ScaleMode, 'absolute'>;
          label?: string;
      }
    | {
          mode: Extract<ScaleMode, 'absolute'>;
          absoluteScale: number;
      };

export type Vector2D = { x: number; y: number };

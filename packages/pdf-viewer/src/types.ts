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

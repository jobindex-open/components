import type { ScaleOption, Size } from 'src/types';
import {
    HORIZONTAL_PADDING,
    SCALE_MAX_AUTO,
    VERTICAL_PADDING,
} from './constants';

export const isPortrait = (size: Size): boolean => {
    return size.width <= size.height;
};

export const scaleOptionToAbsolute = (
    opt: ScaleOption,
    containerSize: Size,
    pageSize: Size,
    padding: Size = { width: HORIZONTAL_PADDING, height: VERTICAL_PADDING }
) => {
    if (opt.mode === 'absolute') return opt.absoluteScale;

    const widthScale =
        (containerSize.width - padding.width * 2) / pageSize.width;
    const heightScale =
        (containerSize.height - padding.height * 2) / pageSize.height;

    const autoScale = isPortrait(pageSize)
        ? widthScale
        : Math.min(widthScale, heightScale);

    switch (opt.mode) {
        case 'fit-width':
            return widthScale;
        case 'fit-height':
            return heightScale;
        case 'auto':
        default:
            return Math.min(SCALE_MAX_AUTO, autoScale);
    }
};

export const sortScaleOptions = (a: ScaleOption, b: ScaleOption) => {
    // Sort numerically if both are absolute
    if (a.mode === 'absolute' && b.mode === 'absolute') {
        if (a.absoluteScale < b.absoluteScale) return -1;
        if (a.absoluteScale > b.absoluteScale) return 1;
        return 0;
    }

    // Otherwise sort absolute last
    if (a.mode === 'absolute') return 1;
    if (b.mode === 'absolute') return -1;

    // Sort other modes alphabetically
    if (a.mode < b.mode) return -1;
    if (a.mode > b.mode) return 1;

    return 0;
};

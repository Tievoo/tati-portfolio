import type { GalleryPic } from "../types";

export function divideInto<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export function calcRatio(img1: GalleryPic, img2?: GalleryPic): [number, number | undefined]  {
    if (img1.orientation === 'hor' && img2?.orientation === 'ver') {
        return [ 67, 33 ];
    } else if (img1.orientation === 'ver' && img2?.orientation === 'hor') {
        return [ 33, 66 ];
    } else {
        const totalWidth = img1.width! + (img2?.width || 0) || 1;
        const pct1 = (img1.width! / totalWidth) * 100;
        const pct2 = ((img2?.width || 0) / totalWidth) * 100;

        return [ Math.round(pct1), Math.round(pct2) ];
    }
}
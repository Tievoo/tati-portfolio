import type { ImageMetadata } from "astro";

type Pic = {
    src: ImageMetadata;
    alt: string;
    width?: number;
    height?: number;
}

export type Cover = Pic & {
    title: string;
    subtitle: string;
    path: string;
}

export type GalleryPic = Pic & {
    orientation: 'hor' | 'ver';
    num: number;
}

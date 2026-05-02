import type { ImageMetadata } from "astro";
import type { GalleryPic } from "../types";
import { getByaOrderPairs, getOrderedFilenames } from "./gallery-order";
import { loadSections } from "./sections";

const allGalleryImages = import.meta.glob('../assets/*/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });
const byaBeforeImages = import.meta.glob('../assets/bya/b/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });
const byaAfterImages = import.meta.glob('../assets/bya/a/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });

function buildPics(entries: Array<[string, any]>, galleryName: string): GalleryPic[] {
    const imageMap = new Map<string, GalleryPic>();

    for (const [path, mod] of entries) {
        const { width, height } = mod as ImageMetadata;
        const orientation: 'hor' | 'ver' = width > height ? 'hor' : 'ver';
        const filename = path.split('/').pop() || '';
        const filenameNoExt = filename.replace(/\.\w+$/, '');

        imageMap.set(filename, {
            src: mod as ImageMetadata,
            width,
            height,
            orientation,
            num: parseInt(filenameNoExt, 10) || 0,
            alt: filenameNoExt.replace(/_/g, ' ').replace(/-/g, ' '),
        });
    }

    const sorted = Array.from(imageMap.values()).sort((a, b) => a.num - b.num);
    const filenames = Array.from(imageMap.keys()).sort((a, b) => {
        const numA = parseInt(a.replace(/\.\w+$/, ''), 10) || 0;
        const numB = parseInt(b.replace(/\.\w+$/, ''), 10) || 0;
        return numA - numB;
    });
    const orderedNames = getOrderedFilenames(galleryName, filenames);

    const ordered = orderedNames
        .map((name) => imageMap.get(name))
        .filter((entry): entry is GalleryPic => Boolean(entry));

    return ordered.length ? ordered : sorted;
}

function getEntriesForSlug(slug: string): Array<[string, any]> {
    return Object.entries(allGalleryImages).filter(([path]) => {
        // path looks like '../assets/<slug>/<filename>.ext'
        const segs = path.split('/');
        return segs[2] === slug;
    });
}

const sections = loadSections();
const galleryImages: Record<string, GalleryPic[]> = {};

for (const section of sections) {
    if (section.type === 'gallery') {
        galleryImages[section.slug] = buildPics(getEntriesForSlug(section.slug), section.slug);
    }
}

galleryImages.bya = buildPics(Object.entries(byaBeforeImages), 'bya');
galleryImages.bya_a = buildPics(Object.entries(byaAfterImages), 'bya');

export const ByaPairs = getByaOrderPairs();

export const Images: Record<string, GalleryPic[]> = galleryImages;

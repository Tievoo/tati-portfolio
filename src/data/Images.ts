import type { ImageMetadata } from "astro";
import type { GalleryPic } from "../types";
import { getByaOrderPairs, getOrderedFilenames } from "./gallery-order";

const imageLoaders = {
    retrato: () => import.meta.glob('../assets/retrato/*.png', { eager: true, import: 'default' }),
    naturaleza: () => import.meta.glob('../assets/naturaleza/*.png', { eager: true, import: 'default' }),
    fotoproducto: () => import.meta.glob('../assets/fotoproducto/*.png', { eager: true, import: 'default' }),
    bya: () => import.meta.glob('../assets/bya/b/*.png', { eager: true, import: 'default' }),
    bya_a: () => import.meta.glob('../assets/bya/a/*.png', { eager: true, import: 'default' }),
};

function importPics(glob: () => Record<string, any>, galleryName: string) {
    const entries = Object.entries(glob());
    
    const imageMap = new Map<string, GalleryPic>();
    
    for (const [path, mod] of entries) {
        const { width, height } = mod as ImageMetadata;
        const orientation: 'hor' | 'ver' = width > height ? 'hor' : 'ver';
        let filename = path.split('/').pop() || '';
        filename = filename.replace('.png', '');

        imageMap.set(filename, {
            src: mod as ImageMetadata,
            width,
            height,
            orientation,
            num: parseInt(filename, 10),
            alt: filename.replace(/_/g, ' ').replace(/-/g, ' ')
        });
    }

    const sorted = Array.from(imageMap.values()).sort((a, b) => a.num - b.num);
    const filenames = sorted.map((img) => `${img.num}.png`);
    const orderedNames = getOrderedFilenames(galleryName, filenames);

    const ordered = orderedNames
        .map((name) => {
            const key = name.replace(".png", "");
            return imageMap.get(key);
        })
        .filter((entry): entry is GalleryPic => Boolean(entry));

    return ordered.length ? ordered : sorted;
}

export const ByaPairs = getByaOrderPairs();


export const Images : Record<string, GalleryPic[]> = {
    retrato: importPics(imageLoaders.retrato, 'retrato'),
    naturaleza: importPics(imageLoaders.naturaleza, 'naturaleza'),
    fotoproducto: importPics(imageLoaders.fotoproducto, 'fotoproducto'),
    bya: importPics(imageLoaders.bya, 'bya'),
    bya_a: importPics(imageLoaders.bya_a, 'bya'),
}

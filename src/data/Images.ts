import type { ImageMetadata } from "astro";
import type { GalleryPic } from "../types";

const imageLoaders = {
    retrato: () => import.meta.glob('../assets/retrato/*.png', { eager: true, import: 'default' }),
    naturaleza: () => import.meta.glob('../assets/naturaleza/*.png', { eager: true, import: 'default' }),
    fotoproducto: () => import.meta.glob('../assets/fotoproducto/*.png', { eager: true, import: 'default' }),
    bya: () => import.meta.glob('../assets/bya/b/*.png', { eager: true, import: 'default' }),
    bya_a: () => import.meta.glob('../assets/bya/a/*.png', { eager: true, import: 'default' }),
};

function importPics(glob: () => Record<string, any>) {
    return Object.entries(glob()).map(([path, mod]) => {
        const { width, height } = mod as ImageMetadata;
        const orientation : 'hor' | 'ver' = width > height ? 'hor' : 'ver';
        let filename = path.split('/').pop() || ''; filename = filename.replace('.png', '');

        return {
            src: mod as ImageMetadata,
            width,
            height,
            orientation,
            num: parseInt(filename, 10),
            alt: filename.replace(/_/g, ' ').replace(/-/g, ' ')
        };
    }).sort((a, b) => a.num - b.num);
}


export const Images : Record<string, GalleryPic[]> = {
    retrato: importPics(imageLoaders.retrato),
    naturaleza: importPics(imageLoaders.naturaleza),
    fotoproducto: importPics(imageLoaders.fotoproducto),
    bya: importPics(imageLoaders.bya),
    bya_a: importPics(imageLoaders.bya_a),
}

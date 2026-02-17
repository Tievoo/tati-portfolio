import type { Cover } from '../types';
import { getCoverPath } from './gallery-order';

// Eagerly import all cover images
const coverImages = import.meta.glob('../assets/covers/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });

function resolveCoverImage(galleryName: string) {
    const yamlPath = getCoverPath(galleryName);

    if (yamlPath) {
        // YAML stores paths like "/assets/covers/filename.png"
        // We need to map that to the glob key "../assets/covers/filename.png"
        const filename = yamlPath.split('/').pop();
        if (filename) {
            const globKey = `../assets/covers/${filename}`;
            if (coverImages[globKey]) {
                return coverImages[globKey] as any;
            }
        }
    }

    // Fallback: look for a file named after the gallery
    for (const [path, mod] of Object.entries(coverImages)) {
        const fname = path.split('/').pop()?.replace(/\.\w+$/, '');
        if (fname === galleryName) {
            return mod as any;
        }
    }

    return undefined;
}

const galleryMeta: Array<{ name: string; title: string; subtitle: string; path: string }> = [
    { name: 'retrato', title: 'Retrato', subtitle: '2019-2025', path: '/retrato' },
    { name: 'naturaleza', title: 'Naturaleza', subtitle: '2019-2025', path: '/naturaleza' },
    { name: 'bya', title: 'Antes y Después', subtitle: '2021-2025', path: '/bya' },
    { name: 'fotoproducto', title: 'Fotoproducto', subtitle: '2019-2025', path: '/fotoproducto' },
];

export const Covers: Cover[] = galleryMeta
    .map((g) => {
        const src = resolveCoverImage(g.name);
        if (!src) return null;
        return {
            alt: `Portada de ${g.title}`,
            src,
            title: g.title,
            subtitle: g.subtitle,
            path: g.path,
        };
    })
    .filter((c): c is Cover => c !== null);

import type { Cover } from '../types';
import { getCoverPath } from './gallery-order';
import { loadSections } from './sections';

// Eagerly import all cover images
const coverImages = import.meta.glob('../assets/covers/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });

function resolveCoverImage(galleryName: string, sectionCover?: string) {
    // YAML stores paths like "/assets/covers/filename.png"
    // We need to map that to the glob key "../assets/covers/filename.png"
    const yamlPath = sectionCover ?? getCoverPath(galleryName);

    if (yamlPath) {
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

export const Covers: Cover[] = loadSections()
    .map((section) => {
        const src = resolveCoverImage(section.slug, section.cover);
        if (!src) return null;
        return {
            alt: `Portada de ${section.title}`,
            src,
            title: section.title,
            subtitle: section.subtitle,
            path: `/${section.slug}`,
        };
    })
    .filter((c): c is Cover => c !== null);

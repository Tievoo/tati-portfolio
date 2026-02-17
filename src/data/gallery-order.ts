import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import YAML from "yaml";

type OrderConfig = {
    cover?: string;
    items?: Array<{
        image?: string;
        before?: string;
        after?: string;
        alt?: string;
    }>;
    order?: Array<string | { image?: string }>;
};

const ordersRoot = resolve(process.cwd(), "src/content/gallery-orders");

const configCache = new Map<string, OrderConfig>();

function loadYamlConfig(fileName: string): OrderConfig | undefined {
    if (configCache.has(fileName)) {
        return configCache.get(fileName);
    }

    try {
        const configPath = resolve(ordersRoot, fileName);
        const raw = readFileSync(configPath, "utf-8");
        const parsed = YAML.parse(raw) as OrderConfig;
        configCache.set(fileName, parsed || {});
        return parsed || {};
    } catch {
        configCache.set(fileName, {});
        return {};
    }
}

function normalizeFilename(value?: string) {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return basename(trimmed);
}

export function getOrderedFilenames(galleryName: string, filenames: string[]): string[] {
    const config = loadYamlConfig(`${galleryName}.yml`);
    const order = (config?.order || [])
        .map((entry) => {
            if (typeof entry === "string") {
                return normalizeFilename(entry);
            }

            return normalizeFilename(entry?.image);
        })
        .filter((entry): entry is string => Boolean(entry));

    if (order.length === 0) {
        return filenames;
    }

    const remaining = new Set(filenames);
    const ordered: string[] = [];

    for (const name of order) {
        if (remaining.has(name)) {
            ordered.push(name);
            remaining.delete(name);
        }
    }

    for (const name of filenames) {
        if (remaining.has(name)) {
            ordered.push(name);
            remaining.delete(name);
        }
    }

    return ordered;
}

export function getByaOrderPairs(): Array<{ before?: string; after?: string; alt?: string }>
{
    const config = loadYamlConfig("bya.yml");
    const items = config?.items || [];

    return items
        .map((item) => ({
            before: normalizeFilename(item.before || item.image),
            after: normalizeFilename(item.after),
            alt: item.alt?.trim() || undefined
        }))
        .filter((item) => item.before || item.after);
}

export function getCoverPath(galleryName: string): string | undefined {
    const config = loadYamlConfig(`${galleryName}.yml`);
    const cover = config?.cover?.trim();
    if (!cover) return undefined;
    return cover;
}

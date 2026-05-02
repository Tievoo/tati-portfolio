import YAML from "yaml";

export type SectionType = "gallery" | "bya";

export type Section = {
    slug: string;
    title: string;
    subtitle: string;
    type: SectionType;
    cover?: string;
    horWidth?: number;
    verWidth?: number;
};

type SectionsFile = {
    sections?: Array<Partial<Section>>;
};

// Loaded via Vite glob so HMR invalidates this module when sections.yml changes.
const sectionsYamlFiles = import.meta.glob<string>(
    "../content/sections.yml",
    { eager: true, query: "?raw", import: "default" },
);
const sectionsYaml = Object.values(sectionsYamlFiles)[0] ?? "";

function isValidType(value: unknown): value is SectionType {
    return value === "gallery" || value === "bya";
}

function toNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
}

export function loadSections(): Section[] {
    let parsed: SectionsFile = {};
    try {
        parsed = (YAML.parse(sectionsYaml) || {}) as SectionsFile;
    } catch {
        parsed = {};
    }

    const list = Array.isArray(parsed.sections) ? parsed.sections : [];
    return list
        .map((entry) => {
            const slug = entry?.slug?.trim();
            const title = entry?.title?.trim();
            if (!slug || !title) return undefined;
            const type = isValidType(entry?.type) ? entry!.type! : "gallery";
            return {
                slug,
                title,
                subtitle: entry?.subtitle?.trim() || "",
                type,
                cover: entry?.cover?.trim() || undefined,
                horWidth: toNumber(entry?.horWidth),
                verWidth: toNumber(entry?.verWidth),
            } satisfies Section;
        })
        .filter((s): s is Section => Boolean(s));
}

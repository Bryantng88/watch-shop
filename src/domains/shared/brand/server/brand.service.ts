import type { CreateBrandInput } from "../types";
import {
    createBrandRecord,
    findBrandByNameInsensitive,
    findBrandBySlug,
    listActiveBrands,
} from "./brand.repo";

function slugify(input: string) {
    return input
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function buildUniqueSlug(name: string) {
    const baseSlug = slugify(name) || "brand";
    let slug = baseSlug;
    let index = 2;

    while (await findBrandBySlug(slug)) {
        slug = `${baseSlug}-${index}`;
        index += 1;
    }

    return slug;
}

export async function createBrandQuick(input: CreateBrandInput) {
    const name = input.name.trim().replace(/\s+/g, " ");

    if (!name) {
        throw new Error("Tên brand không được để trống.");
    }

    const existing = await findBrandByNameInsensitive(name);

    if (existing) {
        throw new Error(`Brand "${existing.name}" đã tồn tại.`);
    }

    const slug = await buildUniqueSlug(name);

    return createBrandRecord({
        name,
        slug,
    });
}

export async function getActiveBrandOptions() {
    return listActiveBrands();
}
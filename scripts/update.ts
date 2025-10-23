import { PrismaClient, BrandStatus } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
    const brands = [
        {
            name: "Rolex",
            country: "Switzerland",
            foundedYear: 1905,
            website: "https://www.rolex.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Rolex_logo.svg",
            description: "Luxury Swiss watch manufacturer known for precision and prestige.",
            isAuthorized: true,
        },
        {
            name: "Omega",
            country: "Switzerland",
            foundedYear: 1848,
            website: "https://www.omegawatches.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Omega_Logo.svg",
            description: "Swiss brand famed for Speedmaster and association with NASA.",
            isAuthorized: true,
        },
        {
            name: "TAG Heuer",
            country: "Switzerland",
            foundedYear: 1860,
            website: "https://www.tagheuer.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/TAG_Heuer_Logo.svg",
            description: "Sports watches and chronographs with avant-garde design.",
            isAuthorized: true,
        },
        {
            name: "Seiko",
            country: "Japan",
            foundedYear: 1881,
            website: "https://www.seikowatches.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Seiko_logo.svg",
            description: "Innovative Japanese watchmaker known for quartz and Spring Drive.",
        },
        {
            name: "Citizen",
            country: "Japan",
            foundedYear: 1918,
            website: "https://www.citizenwatch-global.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Citizen_logo.svg",
            description: "Eco-Drive pioneer and one of the largest watchmakers in the world.",
        },
        {
            name: "Casio",
            country: "Japan",
            foundedYear: 1946,
            website: "https://www.casio.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Casio_logo.svg",
            description: "Known for digital watches, G-Shock, and affordable innovation.",
        },
        {
            name: "Tissot",
            country: "Switzerland",
            foundedYear: 1853,
            website: "https://www.tissotwatches.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Tissot_Logo.svg",
            description: "Swiss watch brand blending tradition and modernity.",
        },
        {
            name: "Longines",
            country: "Switzerland",
            foundedYear: 1832,
            website: "https://www.longines.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Longines_Logo.svg",
            description: "Elegant Swiss brand with strong heritage in timekeeping.",
        },
        {
            name: "Audemars Piguet",
            country: "Switzerland",
            foundedYear: 1875,
            website: "https://www.audemarspiguet.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Audemars_Piguet_Logo.svg",
            description: "High-end Swiss manufacturer, famous for the Royal Oak.",
        },
        {
            name: "Patek Philippe",
            country: "Switzerland",
            foundedYear: 1839,
            website: "https://www.patek.com",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Patek_Philippe_logo.svg",
            description: "Prestigious Swiss watchmaker with timeless complications.",
        },
    ];

    for (let i = 0; i < brands.length; i++) {
        const b = brands[i];
        await prisma.brand.upsert({
            where: { slug: slugify(b.name, { lower: true }) },
            update: {},
            create: {
                ...b,
                slug: slugify(b.name, { lower: true }),
                status: BrandStatus.ACTIVE,
                sortOrder: i,
            },
        });
    }

    console.log("✅ Seeded watch brands successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const product = await prisma.product.create({
            data: {
                title: "Test product draft",
                contentStatus: "DRAFT",
                type: "WATCH", // phải đảm bảo enum type này đúng với enum ProductType trong schema
            },
            select: { id: true, slug: true, title: true, type: true, contentStatus: true }
        });
        console.log("Created product:", product);
    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
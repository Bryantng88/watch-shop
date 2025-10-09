import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



async function main() {
    const sample = await prisma.product.findMany({
        take: 3,
        include: { variants: { take: 2 } },
        orderBy: { createdAt: 'desc' },
    })


    console.dir(sample, { depth: null })
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
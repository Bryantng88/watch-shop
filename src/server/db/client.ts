import { PrismaClient } from '@prisma/client'

// 👇 Tạo biến toàn cục để tránh multiple instance (khi hot reload trong dev)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// 👇 Khởi tạo Prisma client (chỉ 1 instance)
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['error', 'warn'], // thêm 'query' nếu bạn muốn log truy vấn SQL
    })

// 👇 Ở môi trường development, giữ client lại trong global scope
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

await prisma.$queryRaw`SELECT 1`; // nếu chạy OK là kết nối ổn

export default prisma

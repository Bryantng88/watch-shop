import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'



// 👇 Tạo biến toàn cục để tránh multiple instance (khi hot reload trong dev)
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}


// 👇 Khởi tạo Prisma client (chỉ 1 instance)
export const prisma =
    global.prisma ??
    new PrismaClient({
        log: ['error', 'warn'], // thêm 'query' nếu bạn muốn log truy vấn SQL
    })
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

(prisma as any).$use(async (params: any, next: any) => {
    // chỉ áp dụng cho bảng Product khi create
    if (params.model === "Product" && params.action === "create") {
        const data = params.args.data;

        if (data.title && !data.slug) {
            let baseSlug = slugify(data.title, { lower: true, strict: true });
            let slug = baseSlug;
            let counter = 1;

            // Kiểm tra nếu slug đã tồn tại
            while (await prisma.product.findUnique({ where: { slug } })) {
                counter++;
                slug = `${baseSlug}-${counter}`;
            }

            data.slug = slug;
        }
    }

    return next(params);
});



// 👇 Ở môi trường development, giữ client lại trong global scope




export default prisma

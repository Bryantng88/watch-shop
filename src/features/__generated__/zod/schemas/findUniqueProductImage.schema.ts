import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './objects/ProductImageInclude.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './objects/ProductImageWhereUniqueInput.schema';

export const ProductImageFindUniqueSchema: z.ZodType<Prisma.ProductImageFindUniqueArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), where: ProductImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductImageFindUniqueArgs>;

export const ProductImageFindUniqueZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), where: ProductImageWhereUniqueInputObjectSchema }).strict();
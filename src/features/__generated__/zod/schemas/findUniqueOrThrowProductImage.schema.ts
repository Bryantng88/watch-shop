import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './objects/ProductImageInclude.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './objects/ProductImageWhereUniqueInput.schema';

export const ProductImageFindUniqueOrThrowSchema: z.ZodType<Prisma.ProductImageFindUniqueOrThrowArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), where: ProductImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductImageFindUniqueOrThrowArgs>;

export const ProductImageFindUniqueOrThrowZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), where: ProductImageWhereUniqueInputObjectSchema }).strict();
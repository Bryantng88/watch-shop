import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './objects/ProductContentSelect.schema';
import { ProductContentIncludeObjectSchema as ProductContentIncludeObjectSchema } from './objects/ProductContentInclude.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './objects/ProductContentWhereUniqueInput.schema';

export const ProductContentDeleteOneSchema: z.ZodType<Prisma.ProductContentDeleteArgs> = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), where: ProductContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductContentDeleteArgs>;

export const ProductContentDeleteOneZodSchema = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), where: ProductContentWhereUniqueInputObjectSchema }).strict();
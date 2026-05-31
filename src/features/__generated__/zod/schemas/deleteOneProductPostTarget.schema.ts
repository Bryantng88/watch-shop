import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './objects/ProductPostTargetSelect.schema';
import { ProductPostTargetIncludeObjectSchema as ProductPostTargetIncludeObjectSchema } from './objects/ProductPostTargetInclude.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './objects/ProductPostTargetWhereUniqueInput.schema';

export const ProductPostTargetDeleteOneSchema: z.ZodType<Prisma.ProductPostTargetDeleteArgs> = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), where: ProductPostTargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetDeleteArgs>;

export const ProductPostTargetDeleteOneZodSchema = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), where: ProductPostTargetWhereUniqueInputObjectSchema }).strict();
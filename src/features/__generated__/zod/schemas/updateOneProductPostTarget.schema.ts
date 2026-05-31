import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './objects/ProductPostTargetSelect.schema';
import { ProductPostTargetIncludeObjectSchema as ProductPostTargetIncludeObjectSchema } from './objects/ProductPostTargetInclude.schema';
import { ProductPostTargetUpdateInputObjectSchema as ProductPostTargetUpdateInputObjectSchema } from './objects/ProductPostTargetUpdateInput.schema';
import { ProductPostTargetUncheckedUpdateInputObjectSchema as ProductPostTargetUncheckedUpdateInputObjectSchema } from './objects/ProductPostTargetUncheckedUpdateInput.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './objects/ProductPostTargetWhereUniqueInput.schema';

export const ProductPostTargetUpdateOneSchema: z.ZodType<Prisma.ProductPostTargetUpdateArgs> = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), data: z.union([ProductPostTargetUpdateInputObjectSchema, ProductPostTargetUncheckedUpdateInputObjectSchema]), where: ProductPostTargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateArgs>;

export const ProductPostTargetUpdateOneZodSchema = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), data: z.union([ProductPostTargetUpdateInputObjectSchema, ProductPostTargetUncheckedUpdateInputObjectSchema]), where: ProductPostTargetWhereUniqueInputObjectSchema }).strict();
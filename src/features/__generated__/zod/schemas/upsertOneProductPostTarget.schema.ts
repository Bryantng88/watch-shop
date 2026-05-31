import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './objects/ProductPostTargetSelect.schema';
import { ProductPostTargetIncludeObjectSchema as ProductPostTargetIncludeObjectSchema } from './objects/ProductPostTargetInclude.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './objects/ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetCreateInputObjectSchema as ProductPostTargetCreateInputObjectSchema } from './objects/ProductPostTargetCreateInput.schema';
import { ProductPostTargetUncheckedCreateInputObjectSchema as ProductPostTargetUncheckedCreateInputObjectSchema } from './objects/ProductPostTargetUncheckedCreateInput.schema';
import { ProductPostTargetUpdateInputObjectSchema as ProductPostTargetUpdateInputObjectSchema } from './objects/ProductPostTargetUpdateInput.schema';
import { ProductPostTargetUncheckedUpdateInputObjectSchema as ProductPostTargetUncheckedUpdateInputObjectSchema } from './objects/ProductPostTargetUncheckedUpdateInput.schema';

export const ProductPostTargetUpsertOneSchema: z.ZodType<Prisma.ProductPostTargetUpsertArgs> = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), where: ProductPostTargetWhereUniqueInputObjectSchema, create: z.union([ ProductPostTargetCreateInputObjectSchema, ProductPostTargetUncheckedCreateInputObjectSchema ]), update: z.union([ ProductPostTargetUpdateInputObjectSchema, ProductPostTargetUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetUpsertArgs>;

export const ProductPostTargetUpsertOneZodSchema = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), where: ProductPostTargetWhereUniqueInputObjectSchema, create: z.union([ ProductPostTargetCreateInputObjectSchema, ProductPostTargetUncheckedCreateInputObjectSchema ]), update: z.union([ ProductPostTargetUpdateInputObjectSchema, ProductPostTargetUncheckedUpdateInputObjectSchema ]) }).strict();
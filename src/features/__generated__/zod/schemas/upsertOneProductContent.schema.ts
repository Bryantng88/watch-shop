import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './objects/ProductContentSelect.schema';
import { ProductContentIncludeObjectSchema as ProductContentIncludeObjectSchema } from './objects/ProductContentInclude.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './objects/ProductContentWhereUniqueInput.schema';
import { ProductContentCreateInputObjectSchema as ProductContentCreateInputObjectSchema } from './objects/ProductContentCreateInput.schema';
import { ProductContentUncheckedCreateInputObjectSchema as ProductContentUncheckedCreateInputObjectSchema } from './objects/ProductContentUncheckedCreateInput.schema';
import { ProductContentUpdateInputObjectSchema as ProductContentUpdateInputObjectSchema } from './objects/ProductContentUpdateInput.schema';
import { ProductContentUncheckedUpdateInputObjectSchema as ProductContentUncheckedUpdateInputObjectSchema } from './objects/ProductContentUncheckedUpdateInput.schema';

export const ProductContentUpsertOneSchema: z.ZodType<Prisma.ProductContentUpsertArgs> = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), where: ProductContentWhereUniqueInputObjectSchema, create: z.union([ ProductContentCreateInputObjectSchema, ProductContentUncheckedCreateInputObjectSchema ]), update: z.union([ ProductContentUpdateInputObjectSchema, ProductContentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProductContentUpsertArgs>;

export const ProductContentUpsertOneZodSchema = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), where: ProductContentWhereUniqueInputObjectSchema, create: z.union([ ProductContentCreateInputObjectSchema, ProductContentUncheckedCreateInputObjectSchema ]), update: z.union([ ProductContentUpdateInputObjectSchema, ProductContentUncheckedUpdateInputObjectSchema ]) }).strict();
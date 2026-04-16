import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './objects/ProductImageInclude.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './objects/ProductImageWhereUniqueInput.schema';
import { ProductImageCreateInputObjectSchema as ProductImageCreateInputObjectSchema } from './objects/ProductImageCreateInput.schema';
import { ProductImageUncheckedCreateInputObjectSchema as ProductImageUncheckedCreateInputObjectSchema } from './objects/ProductImageUncheckedCreateInput.schema';
import { ProductImageUpdateInputObjectSchema as ProductImageUpdateInputObjectSchema } from './objects/ProductImageUpdateInput.schema';
import { ProductImageUncheckedUpdateInputObjectSchema as ProductImageUncheckedUpdateInputObjectSchema } from './objects/ProductImageUncheckedUpdateInput.schema';

export const ProductImageUpsertOneSchema: z.ZodType<Prisma.ProductImageUpsertArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), where: ProductImageWhereUniqueInputObjectSchema, create: z.union([ ProductImageCreateInputObjectSchema, ProductImageUncheckedCreateInputObjectSchema ]), update: z.union([ ProductImageUpdateInputObjectSchema, ProductImageUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProductImageUpsertArgs>;

export const ProductImageUpsertOneZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), where: ProductImageWhereUniqueInputObjectSchema, create: z.union([ ProductImageCreateInputObjectSchema, ProductImageUncheckedCreateInputObjectSchema ]), update: z.union([ ProductImageUpdateInputObjectSchema, ProductImageUncheckedUpdateInputObjectSchema ]) }).strict();
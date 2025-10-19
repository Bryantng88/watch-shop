import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './objects/ProductImageInclude.schema';
import { ProductImageCreateInputObjectSchema as ProductImageCreateInputObjectSchema } from './objects/ProductImageCreateInput.schema';
import { ProductImageUncheckedCreateInputObjectSchema as ProductImageUncheckedCreateInputObjectSchema } from './objects/ProductImageUncheckedCreateInput.schema';

export const ProductImageCreateOneSchema: z.ZodType<Prisma.ProductImageCreateArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), data: z.union([ProductImageCreateInputObjectSchema, ProductImageUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProductImageCreateArgs>;

export const ProductImageCreateOneZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), data: z.union([ProductImageCreateInputObjectSchema, ProductImageUncheckedCreateInputObjectSchema]) }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './objects/ProductContentSelect.schema';
import { ProductContentIncludeObjectSchema as ProductContentIncludeObjectSchema } from './objects/ProductContentInclude.schema';
import { ProductContentCreateInputObjectSchema as ProductContentCreateInputObjectSchema } from './objects/ProductContentCreateInput.schema';
import { ProductContentUncheckedCreateInputObjectSchema as ProductContentUncheckedCreateInputObjectSchema } from './objects/ProductContentUncheckedCreateInput.schema';

export const ProductContentCreateOneSchema: z.ZodType<Prisma.ProductContentCreateArgs> = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), data: z.union([ProductContentCreateInputObjectSchema, ProductContentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProductContentCreateArgs>;

export const ProductContentCreateOneZodSchema = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), data: z.union([ProductContentCreateInputObjectSchema, ProductContentUncheckedCreateInputObjectSchema]) }).strict();
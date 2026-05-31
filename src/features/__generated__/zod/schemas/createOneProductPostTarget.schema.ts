import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './objects/ProductPostTargetSelect.schema';
import { ProductPostTargetIncludeObjectSchema as ProductPostTargetIncludeObjectSchema } from './objects/ProductPostTargetInclude.schema';
import { ProductPostTargetCreateInputObjectSchema as ProductPostTargetCreateInputObjectSchema } from './objects/ProductPostTargetCreateInput.schema';
import { ProductPostTargetUncheckedCreateInputObjectSchema as ProductPostTargetUncheckedCreateInputObjectSchema } from './objects/ProductPostTargetUncheckedCreateInput.schema';

export const ProductPostTargetCreateOneSchema: z.ZodType<Prisma.ProductPostTargetCreateArgs> = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), data: z.union([ProductPostTargetCreateInputObjectSchema, ProductPostTargetUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetCreateArgs>;

export const ProductPostTargetCreateOneZodSchema = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), data: z.union([ProductPostTargetCreateInputObjectSchema, ProductPostTargetUncheckedCreateInputObjectSchema]) }).strict();
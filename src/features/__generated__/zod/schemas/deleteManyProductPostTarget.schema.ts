import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetWhereInputObjectSchema as ProductPostTargetWhereInputObjectSchema } from './objects/ProductPostTargetWhereInput.schema';

export const ProductPostTargetDeleteManySchema: z.ZodType<Prisma.ProductPostTargetDeleteManyArgs> = z.object({ where: ProductPostTargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetDeleteManyArgs>;

export const ProductPostTargetDeleteManyZodSchema = z.object({ where: ProductPostTargetWhereInputObjectSchema.optional() }).strict();
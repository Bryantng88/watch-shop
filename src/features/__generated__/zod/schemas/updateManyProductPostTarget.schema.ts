import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetUpdateManyMutationInputObjectSchema as ProductPostTargetUpdateManyMutationInputObjectSchema } from './objects/ProductPostTargetUpdateManyMutationInput.schema';
import { ProductPostTargetWhereInputObjectSchema as ProductPostTargetWhereInputObjectSchema } from './objects/ProductPostTargetWhereInput.schema';

export const ProductPostTargetUpdateManySchema: z.ZodType<Prisma.ProductPostTargetUpdateManyArgs> = z.object({ data: ProductPostTargetUpdateManyMutationInputObjectSchema, where: ProductPostTargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateManyArgs>;

export const ProductPostTargetUpdateManyZodSchema = z.object({ data: ProductPostTargetUpdateManyMutationInputObjectSchema, where: ProductPostTargetWhereInputObjectSchema.optional() }).strict();
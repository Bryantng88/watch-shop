import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './objects/ProductPostTargetSelect.schema';
import { ProductPostTargetUpdateManyMutationInputObjectSchema as ProductPostTargetUpdateManyMutationInputObjectSchema } from './objects/ProductPostTargetUpdateManyMutationInput.schema';
import { ProductPostTargetWhereInputObjectSchema as ProductPostTargetWhereInputObjectSchema } from './objects/ProductPostTargetWhereInput.schema';

export const ProductPostTargetUpdateManyAndReturnSchema: z.ZodType<Prisma.ProductPostTargetUpdateManyAndReturnArgs> = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), data: ProductPostTargetUpdateManyMutationInputObjectSchema, where: ProductPostTargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateManyAndReturnArgs>;

export const ProductPostTargetUpdateManyAndReturnZodSchema = z.object({ select: ProductPostTargetSelectObjectSchema.optional(), data: ProductPostTargetUpdateManyMutationInputObjectSchema, where: ProductPostTargetWhereInputObjectSchema.optional() }).strict();
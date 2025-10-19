import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandUpdateManyMutationInputObjectSchema as BrandUpdateManyMutationInputObjectSchema } from './objects/BrandUpdateManyMutationInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';

export const BrandUpdateManySchema: z.ZodType<Prisma.BrandUpdateManyArgs> = z.object({ data: BrandUpdateManyMutationInputObjectSchema, where: BrandWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandUpdateManyArgs>;

export const BrandUpdateManyZodSchema = z.object({ data: BrandUpdateManyMutationInputObjectSchema, where: BrandWhereInputObjectSchema.optional() }).strict();
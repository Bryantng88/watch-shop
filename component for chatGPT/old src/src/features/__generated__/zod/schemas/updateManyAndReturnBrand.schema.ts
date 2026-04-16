import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandSelectObjectSchema as BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandUpdateManyMutationInputObjectSchema as BrandUpdateManyMutationInputObjectSchema } from './objects/BrandUpdateManyMutationInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';

export const BrandUpdateManyAndReturnSchema: z.ZodType<Prisma.BrandUpdateManyAndReturnArgs> = z.object({ select: BrandSelectObjectSchema.optional(), data: BrandUpdateManyMutationInputObjectSchema, where: BrandWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandUpdateManyAndReturnArgs>;

export const BrandUpdateManyAndReturnZodSchema = z.object({ select: BrandSelectObjectSchema.optional(), data: BrandUpdateManyMutationInputObjectSchema, where: BrandWhereInputObjectSchema.optional() }).strict();
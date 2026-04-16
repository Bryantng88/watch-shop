import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandSelectObjectSchema as BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema as BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandUpdateInputObjectSchema as BrandUpdateInputObjectSchema } from './objects/BrandUpdateInput.schema';
import { BrandUncheckedUpdateInputObjectSchema as BrandUncheckedUpdateInputObjectSchema } from './objects/BrandUncheckedUpdateInput.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';

export const BrandUpdateOneSchema: z.ZodType<Prisma.BrandUpdateArgs> = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), data: z.union([BrandUpdateInputObjectSchema, BrandUncheckedUpdateInputObjectSchema]), where: BrandWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BrandUpdateArgs>;

export const BrandUpdateOneZodSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), data: z.union([BrandUpdateInputObjectSchema, BrandUncheckedUpdateInputObjectSchema]), where: BrandWhereUniqueInputObjectSchema }).strict();
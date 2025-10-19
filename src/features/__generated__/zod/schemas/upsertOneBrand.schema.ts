import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandSelectObjectSchema as BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema as BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';
import { BrandCreateInputObjectSchema as BrandCreateInputObjectSchema } from './objects/BrandCreateInput.schema';
import { BrandUncheckedCreateInputObjectSchema as BrandUncheckedCreateInputObjectSchema } from './objects/BrandUncheckedCreateInput.schema';
import { BrandUpdateInputObjectSchema as BrandUpdateInputObjectSchema } from './objects/BrandUpdateInput.schema';
import { BrandUncheckedUpdateInputObjectSchema as BrandUncheckedUpdateInputObjectSchema } from './objects/BrandUncheckedUpdateInput.schema';

export const BrandUpsertOneSchema: z.ZodType<Prisma.BrandUpsertArgs> = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), where: BrandWhereUniqueInputObjectSchema, create: z.union([ BrandCreateInputObjectSchema, BrandUncheckedCreateInputObjectSchema ]), update: z.union([ BrandUpdateInputObjectSchema, BrandUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BrandUpsertArgs>;

export const BrandUpsertOneZodSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), where: BrandWhereUniqueInputObjectSchema, create: z.union([ BrandCreateInputObjectSchema, BrandUncheckedCreateInputObjectSchema ]), update: z.union([ BrandUpdateInputObjectSchema, BrandUncheckedUpdateInputObjectSchema ]) }).strict();
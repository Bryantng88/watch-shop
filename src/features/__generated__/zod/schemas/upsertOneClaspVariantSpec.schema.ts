import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './objects/ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecIncludeObjectSchema as ClaspVariantSpecIncludeObjectSchema } from './objects/ClaspVariantSpecInclude.schema';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './objects/ClaspVariantSpecWhereUniqueInput.schema';
import { ClaspVariantSpecCreateInputObjectSchema as ClaspVariantSpecCreateInputObjectSchema } from './objects/ClaspVariantSpecCreateInput.schema';
import { ClaspVariantSpecUncheckedCreateInputObjectSchema as ClaspVariantSpecUncheckedCreateInputObjectSchema } from './objects/ClaspVariantSpecUncheckedCreateInput.schema';
import { ClaspVariantSpecUpdateInputObjectSchema as ClaspVariantSpecUpdateInputObjectSchema } from './objects/ClaspVariantSpecUpdateInput.schema';
import { ClaspVariantSpecUncheckedUpdateInputObjectSchema as ClaspVariantSpecUncheckedUpdateInputObjectSchema } from './objects/ClaspVariantSpecUncheckedUpdateInput.schema';

export const ClaspVariantSpecUpsertOneSchema: z.ZodType<Prisma.ClaspVariantSpecUpsertArgs> = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), where: ClaspVariantSpecWhereUniqueInputObjectSchema, create: z.union([ ClaspVariantSpecCreateInputObjectSchema, ClaspVariantSpecUncheckedCreateInputObjectSchema ]), update: z.union([ ClaspVariantSpecUpdateInputObjectSchema, ClaspVariantSpecUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpsertArgs>;

export const ClaspVariantSpecUpsertOneZodSchema = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), where: ClaspVariantSpecWhereUniqueInputObjectSchema, create: z.union([ ClaspVariantSpecCreateInputObjectSchema, ClaspVariantSpecUncheckedCreateInputObjectSchema ]), update: z.union([ ClaspVariantSpecUpdateInputObjectSchema, ClaspVariantSpecUncheckedUpdateInputObjectSchema ]) }).strict();
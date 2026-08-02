import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './objects/ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecIncludeObjectSchema as ClaspVariantSpecIncludeObjectSchema } from './objects/ClaspVariantSpecInclude.schema';
import { ClaspVariantSpecUpdateInputObjectSchema as ClaspVariantSpecUpdateInputObjectSchema } from './objects/ClaspVariantSpecUpdateInput.schema';
import { ClaspVariantSpecUncheckedUpdateInputObjectSchema as ClaspVariantSpecUncheckedUpdateInputObjectSchema } from './objects/ClaspVariantSpecUncheckedUpdateInput.schema';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './objects/ClaspVariantSpecWhereUniqueInput.schema';

export const ClaspVariantSpecUpdateOneSchema: z.ZodType<Prisma.ClaspVariantSpecUpdateArgs> = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), data: z.union([ClaspVariantSpecUpdateInputObjectSchema, ClaspVariantSpecUncheckedUpdateInputObjectSchema]), where: ClaspVariantSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpdateArgs>;

export const ClaspVariantSpecUpdateOneZodSchema = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), data: z.union([ClaspVariantSpecUpdateInputObjectSchema, ClaspVariantSpecUncheckedUpdateInputObjectSchema]), where: ClaspVariantSpecWhereUniqueInputObjectSchema }).strict();
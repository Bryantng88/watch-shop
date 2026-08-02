import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './objects/ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecIncludeObjectSchema as ClaspVariantSpecIncludeObjectSchema } from './objects/ClaspVariantSpecInclude.schema';
import { ClaspVariantSpecCreateInputObjectSchema as ClaspVariantSpecCreateInputObjectSchema } from './objects/ClaspVariantSpecCreateInput.schema';
import { ClaspVariantSpecUncheckedCreateInputObjectSchema as ClaspVariantSpecUncheckedCreateInputObjectSchema } from './objects/ClaspVariantSpecUncheckedCreateInput.schema';

export const ClaspVariantSpecCreateOneSchema: z.ZodType<Prisma.ClaspVariantSpecCreateArgs> = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), data: z.union([ClaspVariantSpecCreateInputObjectSchema, ClaspVariantSpecUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecCreateArgs>;

export const ClaspVariantSpecCreateOneZodSchema = z.object({ select: ClaspVariantSpecSelectObjectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), data: z.union([ClaspVariantSpecCreateInputObjectSchema, ClaspVariantSpecUncheckedCreateInputObjectSchema]) }).strict();
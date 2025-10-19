import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './objects/PartVariantSpecSelect.schema';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './objects/PartVariantSpecInclude.schema';
import { PartVariantSpecCreateInputObjectSchema as PartVariantSpecCreateInputObjectSchema } from './objects/PartVariantSpecCreateInput.schema';
import { PartVariantSpecUncheckedCreateInputObjectSchema as PartVariantSpecUncheckedCreateInputObjectSchema } from './objects/PartVariantSpecUncheckedCreateInput.schema';

export const PartVariantSpecCreateOneSchema: z.ZodType<Prisma.PartVariantSpecCreateArgs> = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), data: z.union([PartVariantSpecCreateInputObjectSchema, PartVariantSpecUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecCreateArgs>;

export const PartVariantSpecCreateOneZodSchema = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), data: z.union([PartVariantSpecCreateInputObjectSchema, PartVariantSpecUncheckedCreateInputObjectSchema]) }).strict();
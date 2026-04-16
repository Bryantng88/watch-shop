import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './objects/StrapVariantSpecSelect.schema';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './objects/StrapVariantSpecInclude.schema';
import { StrapVariantSpecCreateInputObjectSchema as StrapVariantSpecCreateInputObjectSchema } from './objects/StrapVariantSpecCreateInput.schema';
import { StrapVariantSpecUncheckedCreateInputObjectSchema as StrapVariantSpecUncheckedCreateInputObjectSchema } from './objects/StrapVariantSpecUncheckedCreateInput.schema';

export const StrapVariantSpecCreateOneSchema: z.ZodType<Prisma.StrapVariantSpecCreateArgs> = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), data: z.union([StrapVariantSpecCreateInputObjectSchema, StrapVariantSpecUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateArgs>;

export const StrapVariantSpecCreateOneZodSchema = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), data: z.union([StrapVariantSpecCreateInputObjectSchema, StrapVariantSpecUncheckedCreateInputObjectSchema]) }).strict();
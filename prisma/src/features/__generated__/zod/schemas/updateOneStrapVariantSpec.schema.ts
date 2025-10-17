import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './objects/StrapVariantSpecSelect.schema';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './objects/StrapVariantSpecInclude.schema';
import { StrapVariantSpecUpdateInputObjectSchema as StrapVariantSpecUpdateInputObjectSchema } from './objects/StrapVariantSpecUpdateInput.schema';
import { StrapVariantSpecUncheckedUpdateInputObjectSchema as StrapVariantSpecUncheckedUpdateInputObjectSchema } from './objects/StrapVariantSpecUncheckedUpdateInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './objects/StrapVariantSpecWhereUniqueInput.schema';

export const StrapVariantSpecUpdateOneSchema: z.ZodType<Prisma.StrapVariantSpecUpdateArgs> = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), data: z.union([StrapVariantSpecUpdateInputObjectSchema, StrapVariantSpecUncheckedUpdateInputObjectSchema]), where: StrapVariantSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateArgs>;

export const StrapVariantSpecUpdateOneZodSchema = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), data: z.union([StrapVariantSpecUpdateInputObjectSchema, StrapVariantSpecUncheckedUpdateInputObjectSchema]), where: StrapVariantSpecWhereUniqueInputObjectSchema }).strict();
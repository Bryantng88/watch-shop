import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './objects/StrapVariantSpecSelect.schema';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './objects/StrapVariantSpecInclude.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './objects/StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecCreateInputObjectSchema as StrapVariantSpecCreateInputObjectSchema } from './objects/StrapVariantSpecCreateInput.schema';
import { StrapVariantSpecUncheckedCreateInputObjectSchema as StrapVariantSpecUncheckedCreateInputObjectSchema } from './objects/StrapVariantSpecUncheckedCreateInput.schema';
import { StrapVariantSpecUpdateInputObjectSchema as StrapVariantSpecUpdateInputObjectSchema } from './objects/StrapVariantSpecUpdateInput.schema';
import { StrapVariantSpecUncheckedUpdateInputObjectSchema as StrapVariantSpecUncheckedUpdateInputObjectSchema } from './objects/StrapVariantSpecUncheckedUpdateInput.schema';

export const StrapVariantSpecUpsertOneSchema: z.ZodType<Prisma.StrapVariantSpecUpsertArgs> = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), where: StrapVariantSpecWhereUniqueInputObjectSchema, create: z.union([ StrapVariantSpecCreateInputObjectSchema, StrapVariantSpecUncheckedCreateInputObjectSchema ]), update: z.union([ StrapVariantSpecUpdateInputObjectSchema, StrapVariantSpecUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecUpsertArgs>;

export const StrapVariantSpecUpsertOneZodSchema = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), where: StrapVariantSpecWhereUniqueInputObjectSchema, create: z.union([ StrapVariantSpecCreateInputObjectSchema, StrapVariantSpecUncheckedCreateInputObjectSchema ]), update: z.union([ StrapVariantSpecUpdateInputObjectSchema, StrapVariantSpecUncheckedUpdateInputObjectSchema ]) }).strict();
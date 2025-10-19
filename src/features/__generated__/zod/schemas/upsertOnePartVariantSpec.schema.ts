import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './objects/PartVariantSpecSelect.schema';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './objects/PartVariantSpecInclude.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './objects/PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecCreateInputObjectSchema as PartVariantSpecCreateInputObjectSchema } from './objects/PartVariantSpecCreateInput.schema';
import { PartVariantSpecUncheckedCreateInputObjectSchema as PartVariantSpecUncheckedCreateInputObjectSchema } from './objects/PartVariantSpecUncheckedCreateInput.schema';
import { PartVariantSpecUpdateInputObjectSchema as PartVariantSpecUpdateInputObjectSchema } from './objects/PartVariantSpecUpdateInput.schema';
import { PartVariantSpecUncheckedUpdateInputObjectSchema as PartVariantSpecUncheckedUpdateInputObjectSchema } from './objects/PartVariantSpecUncheckedUpdateInput.schema';

export const PartVariantSpecUpsertOneSchema: z.ZodType<Prisma.PartVariantSpecUpsertArgs> = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), where: PartVariantSpecWhereUniqueInputObjectSchema, create: z.union([ PartVariantSpecCreateInputObjectSchema, PartVariantSpecUncheckedCreateInputObjectSchema ]), update: z.union([ PartVariantSpecUpdateInputObjectSchema, PartVariantSpecUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecUpsertArgs>;

export const PartVariantSpecUpsertOneZodSchema = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), where: PartVariantSpecWhereUniqueInputObjectSchema, create: z.union([ PartVariantSpecCreateInputObjectSchema, PartVariantSpecUncheckedCreateInputObjectSchema ]), update: z.union([ PartVariantSpecUpdateInputObjectSchema, PartVariantSpecUncheckedUpdateInputObjectSchema ]) }).strict();
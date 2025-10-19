import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './objects/PartVariantSpecSelect.schema';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './objects/PartVariantSpecInclude.schema';
import { PartVariantSpecUpdateInputObjectSchema as PartVariantSpecUpdateInputObjectSchema } from './objects/PartVariantSpecUpdateInput.schema';
import { PartVariantSpecUncheckedUpdateInputObjectSchema as PartVariantSpecUncheckedUpdateInputObjectSchema } from './objects/PartVariantSpecUncheckedUpdateInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './objects/PartVariantSpecWhereUniqueInput.schema';

export const PartVariantSpecUpdateOneSchema: z.ZodType<Prisma.PartVariantSpecUpdateArgs> = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), data: z.union([PartVariantSpecUpdateInputObjectSchema, PartVariantSpecUncheckedUpdateInputObjectSchema]), where: PartVariantSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateArgs>;

export const PartVariantSpecUpdateOneZodSchema = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), data: z.union([PartVariantSpecUpdateInputObjectSchema, PartVariantSpecUncheckedUpdateInputObjectSchema]), where: PartVariantSpecWhereUniqueInputObjectSchema }).strict();
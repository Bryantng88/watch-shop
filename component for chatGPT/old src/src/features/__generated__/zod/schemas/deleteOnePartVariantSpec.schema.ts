import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './objects/PartVariantSpecSelect.schema';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './objects/PartVariantSpecInclude.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './objects/PartVariantSpecWhereUniqueInput.schema';

export const PartVariantSpecDeleteOneSchema: z.ZodType<Prisma.PartVariantSpecDeleteArgs> = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), where: PartVariantSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecDeleteArgs>;

export const PartVariantSpecDeleteOneZodSchema = z.object({ select: PartVariantSpecSelectObjectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), where: PartVariantSpecWhereUniqueInputObjectSchema }).strict();
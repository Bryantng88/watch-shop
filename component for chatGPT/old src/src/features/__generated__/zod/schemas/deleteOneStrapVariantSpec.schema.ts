import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './objects/StrapVariantSpecSelect.schema';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './objects/StrapVariantSpecInclude.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './objects/StrapVariantSpecWhereUniqueInput.schema';

export const StrapVariantSpecDeleteOneSchema: z.ZodType<Prisma.StrapVariantSpecDeleteArgs> = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), where: StrapVariantSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecDeleteArgs>;

export const StrapVariantSpecDeleteOneZodSchema = z.object({ select: StrapVariantSpecSelectObjectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), where: StrapVariantSpecWhereUniqueInputObjectSchema }).strict();
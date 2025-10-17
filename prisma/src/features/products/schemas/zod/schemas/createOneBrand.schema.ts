import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandSelectObjectSchema as BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema as BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandCreateInputObjectSchema as BrandCreateInputObjectSchema } from './objects/BrandCreateInput.schema';
import { BrandUncheckedCreateInputObjectSchema as BrandUncheckedCreateInputObjectSchema } from './objects/BrandUncheckedCreateInput.schema';

export const BrandCreateOneSchema: z.ZodType<Prisma.BrandCreateArgs> = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), data: z.union([BrandCreateInputObjectSchema, BrandUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BrandCreateArgs>;

export const BrandCreateOneZodSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), data: z.union([BrandCreateInputObjectSchema, BrandUncheckedCreateInputObjectSchema]) }).strict();
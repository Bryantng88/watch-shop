import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageCreateInputObjectSchema as StorefrontHeroImageCreateInputObjectSchema } from './objects/StorefrontHeroImageCreateInput.schema';
import { StorefrontHeroImageUncheckedCreateInputObjectSchema as StorefrontHeroImageUncheckedCreateInputObjectSchema } from './objects/StorefrontHeroImageUncheckedCreateInput.schema';

export const StorefrontHeroImageCreateOneSchema: z.ZodType<Prisma.StorefrontHeroImageCreateArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  data: z.union([StorefrontHeroImageCreateInputObjectSchema, StorefrontHeroImageUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageCreateArgs>;

export const StorefrontHeroImageCreateOneZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  data: z.union([StorefrontHeroImageCreateInputObjectSchema, StorefrontHeroImageUncheckedCreateInputObjectSchema]) }).strict();
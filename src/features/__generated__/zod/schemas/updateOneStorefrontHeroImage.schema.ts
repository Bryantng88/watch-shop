import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageUpdateInputObjectSchema as StorefrontHeroImageUpdateInputObjectSchema } from './objects/StorefrontHeroImageUpdateInput.schema';
import { StorefrontHeroImageUncheckedUpdateInputObjectSchema as StorefrontHeroImageUncheckedUpdateInputObjectSchema } from './objects/StorefrontHeroImageUncheckedUpdateInput.schema';
import { StorefrontHeroImageWhereUniqueInputObjectSchema as StorefrontHeroImageWhereUniqueInputObjectSchema } from './objects/StorefrontHeroImageWhereUniqueInput.schema';

export const StorefrontHeroImageUpdateOneSchema: z.ZodType<Prisma.StorefrontHeroImageUpdateArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  data: z.union([StorefrontHeroImageUpdateInputObjectSchema, StorefrontHeroImageUncheckedUpdateInputObjectSchema]), where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageUpdateArgs>;

export const StorefrontHeroImageUpdateOneZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  data: z.union([StorefrontHeroImageUpdateInputObjectSchema, StorefrontHeroImageUncheckedUpdateInputObjectSchema]), where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict();
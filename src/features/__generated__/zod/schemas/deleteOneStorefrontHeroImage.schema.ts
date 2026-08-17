import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageWhereUniqueInputObjectSchema as StorefrontHeroImageWhereUniqueInputObjectSchema } from './objects/StorefrontHeroImageWhereUniqueInput.schema';

export const StorefrontHeroImageDeleteOneSchema: z.ZodType<Prisma.StorefrontHeroImageDeleteArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageDeleteArgs>;

export const StorefrontHeroImageDeleteOneZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict();
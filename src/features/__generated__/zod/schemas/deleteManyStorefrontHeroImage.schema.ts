import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageWhereInputObjectSchema as StorefrontHeroImageWhereInputObjectSchema } from './objects/StorefrontHeroImageWhereInput.schema';

export const StorefrontHeroImageDeleteManySchema: z.ZodType<Prisma.StorefrontHeroImageDeleteManyArgs> = z.object({ where: StorefrontHeroImageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageDeleteManyArgs>;

export const StorefrontHeroImageDeleteManyZodSchema = z.object({ where: StorefrontHeroImageWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageUpdateManyMutationInputObjectSchema as StorefrontHeroImageUpdateManyMutationInputObjectSchema } from './objects/StorefrontHeroImageUpdateManyMutationInput.schema';
import { StorefrontHeroImageWhereInputObjectSchema as StorefrontHeroImageWhereInputObjectSchema } from './objects/StorefrontHeroImageWhereInput.schema';

export const StorefrontHeroImageUpdateManySchema: z.ZodType<Prisma.StorefrontHeroImageUpdateManyArgs> = z.object({ data: StorefrontHeroImageUpdateManyMutationInputObjectSchema, where: StorefrontHeroImageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageUpdateManyArgs>;

export const StorefrontHeroImageUpdateManyZodSchema = z.object({ data: StorefrontHeroImageUpdateManyMutationInputObjectSchema, where: StorefrontHeroImageWhereInputObjectSchema.optional() }).strict();
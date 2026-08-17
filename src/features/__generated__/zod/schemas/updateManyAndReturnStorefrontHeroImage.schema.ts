import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageUpdateManyMutationInputObjectSchema as StorefrontHeroImageUpdateManyMutationInputObjectSchema } from './objects/StorefrontHeroImageUpdateManyMutationInput.schema';
import { StorefrontHeroImageWhereInputObjectSchema as StorefrontHeroImageWhereInputObjectSchema } from './objects/StorefrontHeroImageWhereInput.schema';

export const StorefrontHeroImageUpdateManyAndReturnSchema: z.ZodType<Prisma.StorefrontHeroImageUpdateManyAndReturnArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(), data: StorefrontHeroImageUpdateManyMutationInputObjectSchema, where: StorefrontHeroImageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageUpdateManyAndReturnArgs>;

export const StorefrontHeroImageUpdateManyAndReturnZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(), data: StorefrontHeroImageUpdateManyMutationInputObjectSchema, where: StorefrontHeroImageWhereInputObjectSchema.optional() }).strict();
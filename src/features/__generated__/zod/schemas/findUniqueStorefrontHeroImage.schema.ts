import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageWhereUniqueInputObjectSchema as StorefrontHeroImageWhereUniqueInputObjectSchema } from './objects/StorefrontHeroImageWhereUniqueInput.schema';

export const StorefrontHeroImageFindUniqueSchema: z.ZodType<Prisma.StorefrontHeroImageFindUniqueArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageFindUniqueArgs>;

export const StorefrontHeroImageFindUniqueZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict();
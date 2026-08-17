import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageWhereUniqueInputObjectSchema as StorefrontHeroImageWhereUniqueInputObjectSchema } from './objects/StorefrontHeroImageWhereUniqueInput.schema';

export const StorefrontHeroImageFindUniqueOrThrowSchema: z.ZodType<Prisma.StorefrontHeroImageFindUniqueOrThrowArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageFindUniqueOrThrowArgs>;

export const StorefrontHeroImageFindUniqueOrThrowZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema }).strict();
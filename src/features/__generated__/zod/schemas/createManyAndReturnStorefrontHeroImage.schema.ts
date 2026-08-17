import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageCreateManyInputObjectSchema as StorefrontHeroImageCreateManyInputObjectSchema } from './objects/StorefrontHeroImageCreateManyInput.schema';

export const StorefrontHeroImageCreateManyAndReturnSchema: z.ZodType<Prisma.StorefrontHeroImageCreateManyAndReturnArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(), data: z.union([ StorefrontHeroImageCreateManyInputObjectSchema, z.array(StorefrontHeroImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageCreateManyAndReturnArgs>;

export const StorefrontHeroImageCreateManyAndReturnZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(), data: z.union([ StorefrontHeroImageCreateManyInputObjectSchema, z.array(StorefrontHeroImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
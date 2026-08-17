import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageCreateManyInputObjectSchema as StorefrontHeroImageCreateManyInputObjectSchema } from './objects/StorefrontHeroImageCreateManyInput.schema';

export const StorefrontHeroImageCreateManySchema: z.ZodType<Prisma.StorefrontHeroImageCreateManyArgs> = z.object({ data: z.union([ StorefrontHeroImageCreateManyInputObjectSchema, z.array(StorefrontHeroImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageCreateManyArgs>;

export const StorefrontHeroImageCreateManyZodSchema = z.object({ data: z.union([ StorefrontHeroImageCreateManyInputObjectSchema, z.array(StorefrontHeroImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
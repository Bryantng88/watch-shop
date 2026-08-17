import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './objects/StorefrontHeroImageSelect.schema';
import { StorefrontHeroImageWhereUniqueInputObjectSchema as StorefrontHeroImageWhereUniqueInputObjectSchema } from './objects/StorefrontHeroImageWhereUniqueInput.schema';
import { StorefrontHeroImageCreateInputObjectSchema as StorefrontHeroImageCreateInputObjectSchema } from './objects/StorefrontHeroImageCreateInput.schema';
import { StorefrontHeroImageUncheckedCreateInputObjectSchema as StorefrontHeroImageUncheckedCreateInputObjectSchema } from './objects/StorefrontHeroImageUncheckedCreateInput.schema';
import { StorefrontHeroImageUpdateInputObjectSchema as StorefrontHeroImageUpdateInputObjectSchema } from './objects/StorefrontHeroImageUpdateInput.schema';
import { StorefrontHeroImageUncheckedUpdateInputObjectSchema as StorefrontHeroImageUncheckedUpdateInputObjectSchema } from './objects/StorefrontHeroImageUncheckedUpdateInput.schema';

export const StorefrontHeroImageUpsertOneSchema: z.ZodType<Prisma.StorefrontHeroImageUpsertArgs> = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema, create: z.union([ StorefrontHeroImageCreateInputObjectSchema, StorefrontHeroImageUncheckedCreateInputObjectSchema ]), update: z.union([ StorefrontHeroImageUpdateInputObjectSchema, StorefrontHeroImageUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageUpsertArgs>;

export const StorefrontHeroImageUpsertOneZodSchema = z.object({ select: StorefrontHeroImageSelectObjectSchema.optional(),  where: StorefrontHeroImageWhereUniqueInputObjectSchema, create: z.union([ StorefrontHeroImageCreateInputObjectSchema, StorefrontHeroImageUncheckedCreateInputObjectSchema ]), update: z.union([ StorefrontHeroImageUpdateInputObjectSchema, StorefrontHeroImageUncheckedUpdateInputObjectSchema ]) }).strict();
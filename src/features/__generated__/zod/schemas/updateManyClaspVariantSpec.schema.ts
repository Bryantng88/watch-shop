import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecUpdateManyMutationInputObjectSchema as ClaspVariantSpecUpdateManyMutationInputObjectSchema } from './objects/ClaspVariantSpecUpdateManyMutationInput.schema';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './objects/ClaspVariantSpecWhereInput.schema';

export const ClaspVariantSpecUpdateManySchema: z.ZodType<Prisma.ClaspVariantSpecUpdateManyArgs> = z.object({ data: ClaspVariantSpecUpdateManyMutationInputObjectSchema, where: ClaspVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpdateManyArgs>;

export const ClaspVariantSpecUpdateManyZodSchema = z.object({ data: ClaspVariantSpecUpdateManyMutationInputObjectSchema, where: ClaspVariantSpecWhereInputObjectSchema.optional() }).strict();
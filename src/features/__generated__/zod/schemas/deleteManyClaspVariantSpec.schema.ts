import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './objects/ClaspVariantSpecWhereInput.schema';

export const ClaspVariantSpecDeleteManySchema: z.ZodType<Prisma.ClaspVariantSpecDeleteManyArgs> = z.object({ where: ClaspVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecDeleteManyArgs>;

export const ClaspVariantSpecDeleteManyZodSchema = z.object({ where: ClaspVariantSpecWhereInputObjectSchema.optional() }).strict();
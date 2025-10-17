import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './objects/PartVariantSpecWhereInput.schema';

export const PartVariantSpecDeleteManySchema: z.ZodType<Prisma.PartVariantSpecDeleteManyArgs> = z.object({ where: PartVariantSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecDeleteManyArgs>;

export const PartVariantSpecDeleteManyZodSchema = z.object({ where: PartVariantSpecWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';

export const BrandDeleteManySchema: z.ZodType<Prisma.BrandDeleteManyArgs> = z.object({ where: BrandWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandDeleteManyArgs>;

export const BrandDeleteManyZodSchema = z.object({ where: BrandWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';

export const AppTagDeleteManySchema: z.ZodType<Prisma.AppTagDeleteManyArgs> = z.object({ where: AppTagWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagDeleteManyArgs>;

export const AppTagDeleteManyZodSchema = z.object({ where: AppTagWhereInputObjectSchema.optional() }).strict();
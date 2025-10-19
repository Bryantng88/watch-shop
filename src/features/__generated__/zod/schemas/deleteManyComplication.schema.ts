import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationWhereInputObjectSchema as ComplicationWhereInputObjectSchema } from './objects/ComplicationWhereInput.schema';

export const ComplicationDeleteManySchema: z.ZodType<Prisma.ComplicationDeleteManyArgs> = z.object({ where: ComplicationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationDeleteManyArgs>;

export const ComplicationDeleteManyZodSchema = z.object({ where: ComplicationWhereInputObjectSchema.optional() }).strict();
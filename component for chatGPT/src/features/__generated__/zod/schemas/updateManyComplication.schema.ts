import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationUpdateManyMutationInputObjectSchema as ComplicationUpdateManyMutationInputObjectSchema } from './objects/ComplicationUpdateManyMutationInput.schema';
import { ComplicationWhereInputObjectSchema as ComplicationWhereInputObjectSchema } from './objects/ComplicationWhereInput.schema';

export const ComplicationUpdateManySchema: z.ZodType<Prisma.ComplicationUpdateManyArgs> = z.object({ data: ComplicationUpdateManyMutationInputObjectSchema, where: ComplicationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationUpdateManyArgs>;

export const ComplicationUpdateManyZodSchema = z.object({ data: ComplicationUpdateManyMutationInputObjectSchema, where: ComplicationWhereInputObjectSchema.optional() }).strict();
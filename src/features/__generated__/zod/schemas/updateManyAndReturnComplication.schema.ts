import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationUpdateManyMutationInputObjectSchema as ComplicationUpdateManyMutationInputObjectSchema } from './objects/ComplicationUpdateManyMutationInput.schema';
import { ComplicationWhereInputObjectSchema as ComplicationWhereInputObjectSchema } from './objects/ComplicationWhereInput.schema';

export const ComplicationUpdateManyAndReturnSchema: z.ZodType<Prisma.ComplicationUpdateManyAndReturnArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), data: ComplicationUpdateManyMutationInputObjectSchema, where: ComplicationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationUpdateManyAndReturnArgs>;

export const ComplicationUpdateManyAndReturnZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), data: ComplicationUpdateManyMutationInputObjectSchema, where: ComplicationWhereInputObjectSchema.optional() }).strict();
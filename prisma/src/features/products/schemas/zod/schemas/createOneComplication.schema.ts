import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationSelectObjectSchema as ComplicationSelectObjectSchema } from './objects/ComplicationSelect.schema';
import { ComplicationIncludeObjectSchema as ComplicationIncludeObjectSchema } from './objects/ComplicationInclude.schema';
import { ComplicationCreateInputObjectSchema as ComplicationCreateInputObjectSchema } from './objects/ComplicationCreateInput.schema';
import { ComplicationUncheckedCreateInputObjectSchema as ComplicationUncheckedCreateInputObjectSchema } from './objects/ComplicationUncheckedCreateInput.schema';

export const ComplicationCreateOneSchema: z.ZodType<Prisma.ComplicationCreateArgs> = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), data: z.union([ComplicationCreateInputObjectSchema, ComplicationUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ComplicationCreateArgs>;

export const ComplicationCreateOneZodSchema = z.object({ select: ComplicationSelectObjectSchema.optional(), include: ComplicationIncludeObjectSchema.optional(), data: z.union([ComplicationCreateInputObjectSchema, ComplicationUncheckedCreateInputObjectSchema]) }).strict();
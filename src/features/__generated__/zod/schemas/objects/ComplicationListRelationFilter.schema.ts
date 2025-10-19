import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereInputObjectSchema as ComplicationWhereInputObjectSchema } from './ComplicationWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ComplicationWhereInputObjectSchema).optional(),
  some: z.lazy(() => ComplicationWhereInputObjectSchema).optional(),
  none: z.lazy(() => ComplicationWhereInputObjectSchema).optional()
}).strict();
export const ComplicationListRelationFilterObjectSchema: z.ZodType<Prisma.ComplicationListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationListRelationFilter>;
export const ComplicationListRelationFilterObjectZodSchema = makeSchema();

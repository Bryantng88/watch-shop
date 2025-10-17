import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

const complicationscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ComplicationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ComplicationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ComplicationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ComplicationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ComplicationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const ComplicationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ComplicationScalarWhereWithAggregatesInput> = complicationscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ComplicationScalarWhereWithAggregatesInput>;
export const ComplicationScalarWhereWithAggregatesInputObjectZodSchema = complicationscalarwherewithaggregatesinputSchema;

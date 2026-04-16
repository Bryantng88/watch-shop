import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema'

const complicationscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ComplicationScalarWhereInputObjectSchema), z.lazy(() => ComplicationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ComplicationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ComplicationScalarWhereInputObjectSchema), z.lazy(() => ComplicationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const ComplicationScalarWhereInputObjectSchema: z.ZodType<Prisma.ComplicationScalarWhereInput> = complicationscalarwhereinputSchema as unknown as z.ZodType<Prisma.ComplicationScalarWhereInput>;
export const ComplicationScalarWhereInputObjectZodSchema = complicationscalarwhereinputSchema;

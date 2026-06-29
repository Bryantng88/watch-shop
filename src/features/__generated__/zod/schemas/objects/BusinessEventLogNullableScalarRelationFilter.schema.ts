import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => BusinessEventLogWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => BusinessEventLogWhereInputObjectSchema).optional().nullable()
}).strict();
export const BusinessEventLogNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.BusinessEventLogNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogNullableScalarRelationFilter>;
export const BusinessEventLogNullableScalarRelationFilterObjectZodSchema = makeSchema();

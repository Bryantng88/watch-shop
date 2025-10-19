import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordScalarRelationFilterObjectSchema: z.ZodType<Prisma.MaintenanceRecordScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordScalarRelationFilter>;
export const MaintenanceRecordScalarRelationFilterObjectZodSchema = makeSchema();

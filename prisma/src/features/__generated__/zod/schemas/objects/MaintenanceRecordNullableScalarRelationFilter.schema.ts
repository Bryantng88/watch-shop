import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional().nullable()
}).strict();
export const MaintenanceRecordNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.MaintenanceRecordNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordNullableScalarRelationFilter>;
export const MaintenanceRecordNullableScalarRelationFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional(),
  some: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional(),
  none: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordListRelationFilterObjectSchema: z.ZodType<Prisma.MaintenanceRecordListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordListRelationFilter>;
export const MaintenanceRecordListRelationFilterObjectZodSchema = makeSchema();

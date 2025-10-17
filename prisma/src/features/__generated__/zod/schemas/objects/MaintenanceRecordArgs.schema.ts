import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './MaintenanceRecordSelect.schema';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './MaintenanceRecordInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MaintenanceRecordSelectObjectSchema).optional(),
  include: z.lazy(() => MaintenanceRecordIncludeObjectSchema).optional()
}).strict();
export const MaintenanceRecordArgsObjectSchema = makeSchema();
export const MaintenanceRecordArgsObjectZodSchema = makeSchema();

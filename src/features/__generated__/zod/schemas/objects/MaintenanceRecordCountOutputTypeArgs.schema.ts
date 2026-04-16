import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCountOutputTypeSelectObjectSchema as MaintenanceRecordCountOutputTypeSelectObjectSchema } from './MaintenanceRecordCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MaintenanceRecordCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const MaintenanceRecordCountOutputTypeArgsObjectSchema = makeSchema();
export const MaintenanceRecordCountOutputTypeArgsObjectZodSchema = makeSchema();

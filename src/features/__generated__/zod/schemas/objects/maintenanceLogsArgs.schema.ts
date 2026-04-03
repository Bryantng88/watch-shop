import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './maintenanceLogsSelect.schema';
import { maintenanceLogsIncludeObjectSchema as maintenanceLogsIncludeObjectSchema } from './maintenanceLogsInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => maintenanceLogsSelectObjectSchema).optional(),
  include: z.lazy(() => maintenanceLogsIncludeObjectSchema).optional()
}).strict();
export const maintenanceLogsArgsObjectSchema = makeSchema();
export const maintenanceLogsArgsObjectZodSchema = makeSchema();

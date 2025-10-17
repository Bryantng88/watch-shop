import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './MaintenancePartSelect.schema';
import { MaintenancePartIncludeObjectSchema as MaintenancePartIncludeObjectSchema } from './MaintenancePartInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MaintenancePartSelectObjectSchema).optional(),
  include: z.lazy(() => MaintenancePartIncludeObjectSchema).optional()
}).strict();
export const MaintenancePartArgsObjectSchema = makeSchema();
export const MaintenancePartArgsObjectZodSchema = makeSchema();

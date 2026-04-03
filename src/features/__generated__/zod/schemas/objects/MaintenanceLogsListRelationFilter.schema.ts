import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereInputObjectSchema as maintenanceLogsWhereInputObjectSchema } from './maintenanceLogsWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => maintenanceLogsWhereInputObjectSchema).optional(),
  some: z.lazy(() => maintenanceLogsWhereInputObjectSchema).optional(),
  none: z.lazy(() => maintenanceLogsWhereInputObjectSchema).optional()
}).strict();
export const MaintenanceLogsListRelationFilterObjectSchema: z.ZodType<Prisma.MaintenanceLogsListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceLogsListRelationFilter>;
export const MaintenanceLogsListRelationFilterObjectZodSchema = makeSchema();

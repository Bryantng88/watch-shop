import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordArgsObjectSchema as MaintenanceRecordArgsObjectSchema } from './MaintenanceRecordArgs.schema'

const makeSchema = () => z.object({
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordArgsObjectSchema)]).optional()
}).strict();
export const ServiceCatalogIncludeObjectSchema: z.ZodType<Prisma.ServiceCatalogInclude> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogInclude>;
export const ServiceCatalogIncludeObjectZodSchema = makeSchema();

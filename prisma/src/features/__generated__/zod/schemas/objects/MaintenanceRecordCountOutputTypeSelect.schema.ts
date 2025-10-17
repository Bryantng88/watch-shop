import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  parts: z.boolean().optional(),
  serviceDetail: z.boolean().optional()
}).strict();
export const MaintenanceRecordCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.MaintenanceRecordCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCountOutputTypeSelect>;
export const MaintenanceRecordCountOutputTypeSelectObjectZodSchema = makeSchema();

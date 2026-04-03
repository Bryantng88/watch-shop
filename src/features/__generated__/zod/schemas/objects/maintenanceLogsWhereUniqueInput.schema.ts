import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const maintenanceLogsWhereUniqueInputObjectSchema: z.ZodType<Prisma.maintenanceLogsWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsWhereUniqueInput>;
export const maintenanceLogsWhereUniqueInputObjectZodSchema = makeSchema();

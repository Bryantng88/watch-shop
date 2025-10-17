import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const MaintenanceRecordWhereUniqueInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordWhereUniqueInput>;
export const MaintenanceRecordWhereUniqueInputObjectZodSchema = makeSchema();

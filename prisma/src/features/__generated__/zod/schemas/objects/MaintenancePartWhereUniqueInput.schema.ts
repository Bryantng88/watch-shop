import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const MaintenancePartWhereUniqueInputObjectSchema: z.ZodType<Prisma.MaintenancePartWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartWhereUniqueInput>;
export const MaintenancePartWhereUniqueInputObjectZodSchema = makeSchema();

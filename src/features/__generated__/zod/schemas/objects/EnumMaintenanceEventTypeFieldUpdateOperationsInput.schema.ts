import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema'

const makeSchema = () => z.object({
  set: MaintenanceEventTypeSchema.optional()
}).strict();
export const EnumMaintenanceEventTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMaintenanceEventTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMaintenanceEventTypeFieldUpdateOperationsInput>;
export const EnumMaintenanceEventTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

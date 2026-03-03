import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema'

const makeSchema = () => z.object({
  set: ShipmentStatusSchema.optional()
}).strict();
export const EnumShipmentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumShipmentStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumShipmentStatusFieldUpdateOperationsInput>;
export const EnumShipmentStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema'

const makeSchema = () => z.object({
  set: ReservationStatusSchema.optional()
}).strict();
export const EnumReservationStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumReservationStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumReservationStatusFieldUpdateOperationsInput>;
export const EnumReservationStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

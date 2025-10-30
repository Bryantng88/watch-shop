import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema'

const makeSchema = () => z.object({
  set: AvailabilityStatusSchema.optional()
}).strict();
export const EnumAvailabilityStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAvailabilityStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumAvailabilityStatusFieldUpdateOperationsInput>;
export const EnumAvailabilityStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

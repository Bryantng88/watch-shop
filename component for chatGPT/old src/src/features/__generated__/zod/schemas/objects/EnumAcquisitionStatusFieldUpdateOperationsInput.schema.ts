import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema'

const makeSchema = () => z.object({
  set: AcquisitionStatusSchema.optional()
}).strict();
export const EnumAcquisitionStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAcquisitionStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionStatusFieldUpdateOperationsInput>;
export const EnumAcquisitionStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

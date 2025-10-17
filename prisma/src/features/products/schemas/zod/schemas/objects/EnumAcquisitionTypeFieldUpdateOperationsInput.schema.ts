import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema'

const makeSchema = () => z.object({
  set: AcquisitionTypeSchema.optional()
}).strict();
export const EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAcquisitionTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionTypeFieldUpdateOperationsInput>;
export const EnumAcquisitionTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

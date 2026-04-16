import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema'

const makeSchema = () => z.object({
  set: AcquisitionItemStatusSchema.optional()
}).strict();
export const NullableEnumAcquisitionItemStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumAcquisitionItemStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumAcquisitionItemStatusFieldUpdateOperationsInput>;
export const NullableEnumAcquisitionItemStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

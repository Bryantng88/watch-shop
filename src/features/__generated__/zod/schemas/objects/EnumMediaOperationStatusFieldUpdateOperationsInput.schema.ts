import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema'

const makeSchema = () => z.object({
  set: MediaOperationStatusSchema.optional()
}).strict();
export const EnumMediaOperationStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaOperationStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOperationStatusFieldUpdateOperationsInput>;
export const EnumMediaOperationStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

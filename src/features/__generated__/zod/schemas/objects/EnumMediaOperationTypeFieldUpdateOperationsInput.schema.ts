import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema'

const makeSchema = () => z.object({
  set: MediaOperationTypeSchema.optional()
}).strict();
export const EnumMediaOperationTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaOperationTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOperationTypeFieldUpdateOperationsInput>;
export const EnumMediaOperationTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

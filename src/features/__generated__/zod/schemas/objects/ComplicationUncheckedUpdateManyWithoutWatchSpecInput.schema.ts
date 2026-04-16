import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ComplicationUncheckedUpdateManyWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedUpdateManyWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedUpdateManyWithoutWatchSpecInput>;
export const ComplicationUncheckedUpdateManyWithoutWatchSpecInputObjectZodSchema = makeSchema();

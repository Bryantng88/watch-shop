import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WatchSpecUncheckedUpdateManyWithoutComplicationNestedInputObjectSchema as WatchSpecUncheckedUpdateManyWithoutComplicationNestedInputObjectSchema } from './WatchSpecUncheckedUpdateManyWithoutComplicationNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  watchSpecs: z.lazy(() => WatchSpecUncheckedUpdateManyWithoutComplicationNestedInputObjectSchema).optional()
}).strict();
export const ComplicationUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedUpdateInput>;
export const ComplicationUncheckedUpdateInputObjectZodSchema = makeSchema();

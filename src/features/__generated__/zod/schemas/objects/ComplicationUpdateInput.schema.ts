import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WatchSpecUpdateManyWithoutComplicationNestedInputObjectSchema as WatchSpecUpdateManyWithoutComplicationNestedInputObjectSchema } from './WatchSpecUpdateManyWithoutComplicationNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  watchSpecs: z.lazy(() => WatchSpecUpdateManyWithoutComplicationNestedInputObjectSchema).optional()
}).strict();
export const ComplicationUpdateInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateInput>;
export const ComplicationUpdateInputObjectZodSchema = makeSchema();

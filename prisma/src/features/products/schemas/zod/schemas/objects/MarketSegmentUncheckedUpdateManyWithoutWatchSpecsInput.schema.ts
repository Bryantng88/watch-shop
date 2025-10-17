import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInput>;
export const MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInputObjectZodSchema = makeSchema();

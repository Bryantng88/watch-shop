import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedUpdateWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedUpdateWithoutWatchSpecsInput>;
export const MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectZodSchema = makeSchema();

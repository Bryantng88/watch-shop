import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WatchSpecUncheckedUpdateManyWithoutMarketSegmentNestedInputObjectSchema as WatchSpecUncheckedUpdateManyWithoutMarketSegmentNestedInputObjectSchema } from './WatchSpecUncheckedUpdateManyWithoutMarketSegmentNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  watchSpecs: z.lazy(() => WatchSpecUncheckedUpdateManyWithoutMarketSegmentNestedInputObjectSchema).optional()
}).strict();
export const MarketSegmentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedUpdateInput>;
export const MarketSegmentUncheckedUpdateInputObjectZodSchema = makeSchema();

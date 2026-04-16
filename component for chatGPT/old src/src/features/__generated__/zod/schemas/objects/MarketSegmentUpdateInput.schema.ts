import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { WatchSpecUpdateManyWithoutMarketSegmentNestedInputObjectSchema as WatchSpecUpdateManyWithoutMarketSegmentNestedInputObjectSchema } from './WatchSpecUpdateManyWithoutMarketSegmentNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  watchSpecs: z.lazy(() => WatchSpecUpdateManyWithoutMarketSegmentNestedInputObjectSchema).optional()
}).strict();
export const MarketSegmentUpdateInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateInput>;
export const MarketSegmentUpdateInputObjectZodSchema = makeSchema();

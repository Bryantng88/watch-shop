import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MarketSegmentUpdateWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateWithoutWatchSpecInput>;
export const MarketSegmentUpdateWithoutWatchSpecInputObjectZodSchema = makeSchema();

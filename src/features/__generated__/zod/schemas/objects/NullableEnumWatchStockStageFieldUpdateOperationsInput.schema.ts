import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema'

const makeSchema = () => z.object({
  set: WatchStockStageSchema.optional()
}).strict();
export const NullableEnumWatchStockStageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchStockStageFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchStockStageFieldUpdateOperationsInput>;
export const NullableEnumWatchStockStageFieldUpdateOperationsInputObjectZodSchema = makeSchema();

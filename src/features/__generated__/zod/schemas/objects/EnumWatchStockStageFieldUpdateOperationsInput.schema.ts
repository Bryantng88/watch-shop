import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema'

const makeSchema = () => z.object({
  set: WatchStockStageSchema.optional()
}).strict();
export const EnumWatchStockStageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchStockStageFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStockStageFieldUpdateOperationsInput>;
export const EnumWatchStockStageFieldUpdateOperationsInputObjectZodSchema = makeSchema();

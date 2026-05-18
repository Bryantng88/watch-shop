import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema'

const makeSchema = () => z.object({
  set: WatchSaleStageSchema.optional()
}).strict();
export const EnumWatchSaleStageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchSaleStageFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSaleStageFieldUpdateOperationsInput>;
export const EnumWatchSaleStageFieldUpdateOperationsInputObjectZodSchema = makeSchema();

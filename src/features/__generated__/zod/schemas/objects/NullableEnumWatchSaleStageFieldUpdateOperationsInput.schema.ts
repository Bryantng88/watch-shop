import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema'

const makeSchema = () => z.object({
  set: WatchSaleStageSchema.optional()
}).strict();
export const NullableEnumWatchSaleStageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchSaleStageFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchSaleStageFieldUpdateOperationsInput>;
export const NullableEnumWatchSaleStageFieldUpdateOperationsInputObjectZodSchema = makeSchema();

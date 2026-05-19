import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema'

const makeSchema = () => z.object({
  set: WatchServiceStageSchema.optional()
}).strict();
export const NullableEnumWatchServiceStageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchServiceStageFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchServiceStageFieldUpdateOperationsInput>;
export const NullableEnumWatchServiceStageFieldUpdateOperationsInputObjectZodSchema = makeSchema();

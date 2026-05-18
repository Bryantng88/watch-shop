import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema'

const makeSchema = () => z.object({
  set: WatchServiceStageSchema.optional()
}).strict();
export const EnumWatchServiceStageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchServiceStageFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchServiceStageFieldUpdateOperationsInput>;
export const EnumWatchServiceStageFieldUpdateOperationsInputObjectZodSchema = makeSchema();

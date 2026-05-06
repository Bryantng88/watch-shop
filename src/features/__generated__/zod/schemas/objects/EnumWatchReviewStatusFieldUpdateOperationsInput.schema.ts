import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema'

const makeSchema = () => z.object({
  set: WatchReviewStatusSchema.optional()
}).strict();
export const EnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchReviewStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewStatusFieldUpdateOperationsInput>;
export const EnumWatchReviewStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

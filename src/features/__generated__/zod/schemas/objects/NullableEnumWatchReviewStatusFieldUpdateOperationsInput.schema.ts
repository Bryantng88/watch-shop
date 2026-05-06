import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema'

const makeSchema = () => z.object({
  set: WatchReviewStatusSchema.optional()
}).strict();
export const NullableEnumWatchReviewStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchReviewStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchReviewStatusFieldUpdateOperationsInput>;
export const NullableEnumWatchReviewStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

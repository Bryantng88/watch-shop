import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema'

const makeSchema = () => z.object({
  set: WatchReviewTargetTypeSchema.optional()
}).strict();
export const EnumWatchReviewTargetTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchReviewTargetTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewTargetTypeFieldUpdateOperationsInput>;
export const EnumWatchReviewTargetTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

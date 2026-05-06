import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema'

const makeSchema = () => z.object({
  set: WatchReviewActionSchema.optional()
}).strict();
export const EnumWatchReviewActionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchReviewActionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewActionFieldUpdateOperationsInput>;
export const EnumWatchReviewActionFieldUpdateOperationsInputObjectZodSchema = makeSchema();

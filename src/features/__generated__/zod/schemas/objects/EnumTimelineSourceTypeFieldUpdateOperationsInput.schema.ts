import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema'

const makeSchema = () => z.object({
  set: TimelineSourceTypeSchema.optional()
}).strict();
export const EnumTimelineSourceTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTimelineSourceTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTimelineSourceTypeFieldUpdateOperationsInput>;
export const EnumTimelineSourceTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

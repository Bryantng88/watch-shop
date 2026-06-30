import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema'

const makeSchema = () => z.object({
  set: TimelineContainerTypeSchema.optional()
}).strict();
export const EnumTimelineContainerTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTimelineContainerTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTimelineContainerTypeFieldUpdateOperationsInput>;
export const EnumTimelineContainerTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

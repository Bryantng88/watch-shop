import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema'

const makeSchema = () => z.object({
  set: AudienceSegmentSchema.optional()
}).strict();
export const EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAudienceSegmentFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumAudienceSegmentFieldUpdateOperationsInput>;
export const EnumAudienceSegmentFieldUpdateOperationsInputObjectZodSchema = makeSchema();

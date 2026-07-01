import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema'

const makeSchema = () => z.object({
  set: ActivitySourceTypeSchema.optional()
}).strict();
export const EnumActivitySourceTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumActivitySourceTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumActivitySourceTypeFieldUpdateOperationsInput>;
export const EnumActivitySourceTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

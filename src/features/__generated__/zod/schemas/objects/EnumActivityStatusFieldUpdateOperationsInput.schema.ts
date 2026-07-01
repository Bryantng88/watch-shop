import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema'

const makeSchema = () => z.object({
  set: ActivityStatusSchema.optional()
}).strict();
export const EnumActivityStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumActivityStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumActivityStatusFieldUpdateOperationsInput>;
export const EnumActivityStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema'

const makeSchema = () => z.object({
  set: ContentStatusSchema.optional()
}).strict();
export const EnumContentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumContentStatusFieldUpdateOperationsInput>;
export const EnumContentStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

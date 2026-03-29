import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema'

const makeSchema = () => z.object({
  set: ContentStatusSchema.optional()
}).strict();
export const NullableEnumContentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumContentStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumContentStatusFieldUpdateOperationsInput>;
export const NullableEnumContentStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

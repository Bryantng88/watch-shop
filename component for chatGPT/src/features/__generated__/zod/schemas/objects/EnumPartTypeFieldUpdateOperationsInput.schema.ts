import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const makeSchema = () => z.object({
  set: PartTypeSchema.optional()
}).strict();
export const EnumPartTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPartTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPartTypeFieldUpdateOperationsInput>;
export const EnumPartTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

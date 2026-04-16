import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TagSchema } from '../enums/Tag.schema'

const makeSchema = () => z.object({
  set: TagSchema.optional()
}).strict();
export const EnumTagFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTagFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTagFieldUpdateOperationsInput>;
export const EnumTagFieldUpdateOperationsInputObjectZodSchema = makeSchema();

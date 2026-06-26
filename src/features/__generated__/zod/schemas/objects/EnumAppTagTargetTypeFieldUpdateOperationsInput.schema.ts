import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema'

const makeSchema = () => z.object({
  set: AppTagTargetTypeSchema.optional()
}).strict();
export const EnumAppTagTargetTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumAppTagTargetTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagTargetTypeFieldUpdateOperationsInput>;
export const EnumAppTagTargetTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

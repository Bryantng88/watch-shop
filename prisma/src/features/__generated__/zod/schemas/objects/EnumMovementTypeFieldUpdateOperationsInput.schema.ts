import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema'

const makeSchema = () => z.object({
  set: MovementTypeSchema.optional()
}).strict();
export const EnumMovementTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMovementTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMovementTypeFieldUpdateOperationsInput>;
export const EnumMovementTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

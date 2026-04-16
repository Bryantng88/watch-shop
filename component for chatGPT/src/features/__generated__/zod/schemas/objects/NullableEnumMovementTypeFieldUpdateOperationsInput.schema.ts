import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema'

const makeSchema = () => z.object({
  set: MovementTypeSchema.optional()
}).strict();
export const NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumMovementTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumMovementTypeFieldUpdateOperationsInput>;
export const NullableEnumMovementTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

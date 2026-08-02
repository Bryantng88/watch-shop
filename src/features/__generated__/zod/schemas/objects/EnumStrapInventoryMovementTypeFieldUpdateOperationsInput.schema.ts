import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema'

const makeSchema = () => z.object({
  set: StrapInventoryMovementTypeSchema.optional()
}).strict();
export const EnumStrapInventoryMovementTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapInventoryMovementTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapInventoryMovementTypeFieldUpdateOperationsInput>;
export const EnumStrapInventoryMovementTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

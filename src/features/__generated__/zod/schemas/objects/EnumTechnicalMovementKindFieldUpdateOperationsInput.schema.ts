import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema'

const makeSchema = () => z.object({
  set: TechnicalMovementKindSchema.optional()
}).strict();
export const EnumTechnicalMovementKindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTechnicalMovementKindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalMovementKindFieldUpdateOperationsInput>;
export const EnumTechnicalMovementKindFieldUpdateOperationsInputObjectZodSchema = makeSchema();

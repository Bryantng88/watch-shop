import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema'

const makeSchema = () => z.object({
  set: MechanicalPartGroupSchema.optional()
}).strict();
export const EnumMechanicalPartGroupFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMechanicalPartGroupFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMechanicalPartGroupFieldUpdateOperationsInput>;
export const EnumMechanicalPartGroupFieldUpdateOperationsInputObjectZodSchema = makeSchema();

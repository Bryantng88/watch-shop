import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema'

const makeSchema = () => z.object({
  set: StrapOwnershipModeSchema.optional()
}).strict();
export const EnumStrapOwnershipModeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapOwnershipModeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOwnershipModeFieldUpdateOperationsInput>;
export const EnumStrapOwnershipModeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

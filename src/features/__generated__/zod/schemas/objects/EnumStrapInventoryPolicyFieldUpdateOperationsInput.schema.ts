import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema'

const makeSchema = () => z.object({
  set: StrapInventoryPolicySchema.optional()
}).strict();
export const EnumStrapInventoryPolicyFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapInventoryPolicyFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapInventoryPolicyFieldUpdateOperationsInput>;
export const EnumStrapInventoryPolicyFieldUpdateOperationsInputObjectZodSchema = makeSchema();

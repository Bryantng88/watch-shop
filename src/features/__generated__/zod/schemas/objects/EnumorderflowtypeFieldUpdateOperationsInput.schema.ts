import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema'

const makeSchema = () => z.object({
  set: OrderFlowTypeSchema.optional()
}).strict();
export const EnumOrderFlowTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumOrderFlowTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderFlowTypeFieldUpdateOperationsInput>;
export const EnumOrderFlowTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

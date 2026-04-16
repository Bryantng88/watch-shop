import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema'

const makeSchema = () => z.object({
  set: OrderStatusSchema.optional()
}).strict();
export const EnumOrderStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumOrderStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderStatusFieldUpdateOperationsInput>;
export const EnumOrderStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

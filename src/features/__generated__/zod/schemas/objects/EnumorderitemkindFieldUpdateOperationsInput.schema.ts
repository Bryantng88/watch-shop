import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema'

const makeSchema = () => z.object({
  set: OrderItemKindSchema.optional()
}).strict();
export const EnumOrderItemKindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumOrderItemKindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderItemKindFieldUpdateOperationsInput>;
export const EnumOrderItemKindFieldUpdateOperationsInputObjectZodSchema = makeSchema();

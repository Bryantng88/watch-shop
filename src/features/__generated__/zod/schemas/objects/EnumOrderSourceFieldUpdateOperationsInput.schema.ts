import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderSourceSchema } from '../enums/OrderSource.schema'

const makeSchema = () => z.object({
  set: OrderSourceSchema.optional()
}).strict();
export const EnumOrderSourceFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumOrderSourceFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderSourceFieldUpdateOperationsInput>;
export const EnumOrderSourceFieldUpdateOperationsInputObjectZodSchema = makeSchema();

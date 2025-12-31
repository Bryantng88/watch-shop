import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderitemkindSchema } from '../enums/orderitemkind.schema'

const makeSchema = () => z.object({
  set: orderitemkindSchema.optional()
}).strict();
export const EnumorderitemkindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumorderitemkindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumorderitemkindFieldUpdateOperationsInput>;
export const EnumorderitemkindFieldUpdateOperationsInputObjectZodSchema = makeSchema();

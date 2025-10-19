import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema'

const makeSchema = () => z.object({
  set: InvoiceStatusSchema.optional()
}).strict();
export const EnumInvoiceStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumInvoiceStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumInvoiceStatusFieldUpdateOperationsInput>;
export const EnumInvoiceStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();

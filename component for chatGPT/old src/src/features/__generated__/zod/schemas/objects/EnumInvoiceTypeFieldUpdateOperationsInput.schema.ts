import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema'

const makeSchema = () => z.object({
  set: InvoiceTypeSchema.optional()
}).strict();
export const EnumInvoiceTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumInvoiceTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumInvoiceTypeFieldUpdateOperationsInput>;
export const EnumInvoiceTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneWithoutInvoiceItemNestedInputObjectSchema as ProductUpdateOneWithoutInvoiceItemNestedInputObjectSchema } from './ProductUpdateOneWithoutInvoiceItemNestedInput.schema';
import { ProductVariantUpdateOneWithoutInvoiceItemNestedInputObjectSchema as ProductVariantUpdateOneWithoutInvoiceItemNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutInvoiceItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  quantity: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  unitPrice: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  discount: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  taxRate: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  lineTotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneWithoutInvoiceItemNestedInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantUpdateOneWithoutInvoiceItemNestedInputObjectSchema).optional()
}).strict();
export const InvoiceItemUpdateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateWithoutInvoiceInput>;
export const InvoiceItemUpdateWithoutInvoiceInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema as AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema } from './AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInput.schema';
import { OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema as OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema } from './OrderItemUpdateOneWithoutAcquisitionItemNestedInput.schema';
import { ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema as ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutAcquisitionItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  unitCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  currency: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisition: z.lazy(() => AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema).optional(),
  sourceOrderItem: z.lazy(() => OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema).optional()
}).strict();
export const AcquisitionItemUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateWithoutProductInput>;
export const AcquisitionItemUpdateWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema';
import { NullableEnumAcquisitionItemKindFieldUpdateOperationsInputObjectSchema as NullableEnumAcquisitionItemKindFieldUpdateOperationsInputObjectSchema } from './NullableEnumAcquisitionItemKindFieldUpdateOperationsInput.schema';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema';
import { NullableEnumAcquisitionItemStatusFieldUpdateOperationsInputObjectSchema as NullableEnumAcquisitionItemStatusFieldUpdateOperationsInputObjectSchema } from './NullableEnumAcquisitionItemStatusFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { NullableBoolFieldUpdateOperationsInputObjectSchema as NullableBoolFieldUpdateOperationsInputObjectSchema } from './NullableBoolFieldUpdateOperationsInput.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumProductTypeFieldUpdateOperationsInputObjectSchema as EnumProductTypeFieldUpdateOperationsInputObjectSchema } from './EnumProductTypeFieldUpdateOperationsInput.schema';
import { AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema as AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema } from './AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInput.schema';
import { ProductUpdateOneWithoutAcquisitionItemNestedInputObjectSchema as ProductUpdateOneWithoutAcquisitionItemNestedInputObjectSchema } from './ProductUpdateOneWithoutAcquisitionItemNestedInput.schema';
import { OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema as OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema } from './OrderItemUpdateOneWithoutAcquisitionItemNestedInput.schema';
import { ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema as ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema } from './ProductVariantUpdateOneWithoutAcquisitionItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  unitCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  currency: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  kind: z.union([AcquisitionItemKindSchema, z.lazy(() => NullableEnumAcquisitionItemKindFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([AcquisitionItemStatusSchema, z.lazy(() => NullableEnumAcquisitionItemStatusFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  expectedReturnAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  returnedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorRmaNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  warrantyMonths: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceRequestId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  capitalizeToProduct: z.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  productType: z.union([ProductTypeSchema, z.lazy(() => EnumProductTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisition: z.lazy(() => AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneWithoutAcquisitionItemNestedInputObjectSchema).optional(),
  sourceOrderItem: z.lazy(() => OrderItemUpdateOneWithoutAcquisitionItemNestedInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema).optional()
}).strict();
export const AcquisitionItemUpdateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateInput>;
export const AcquisitionItemUpdateInputObjectZodSchema = makeSchema();

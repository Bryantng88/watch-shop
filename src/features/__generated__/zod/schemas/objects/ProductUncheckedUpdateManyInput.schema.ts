import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { EnumProductStatusFieldUpdateOperationsInputObjectSchema as EnumProductStatusFieldUpdateOperationsInputObjectSchema } from './EnumProductStatusFieldUpdateOperationsInput.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumProductTypeFieldUpdateOperationsInputObjectSchema as EnumProductTypeFieldUpdateOperationsInputObjectSchema } from './EnumProductTypeFieldUpdateOperationsInput.schema';
import { TagSchema } from '../enums/Tag.schema';
import { EnumTagFieldUpdateOperationsInputObjectSchema as EnumTagFieldUpdateOperationsInputObjectSchema } from './EnumTagFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([ProductStatusSchema, z.lazy(() => EnumProductStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  primaryImageUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([ProductTypeSchema, z.lazy(() => EnumProductTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  tag: z.union([TagSchema, z.lazy(() => EnumTagFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  seoTitle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  seoDescription: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isStockManaged: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  maxQtyPerOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  publishedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ProductUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedUpdateManyInput>;
export const ProductUncheckedUpdateManyInputObjectZodSchema = makeSchema();

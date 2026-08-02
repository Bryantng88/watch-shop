import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema as EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema } from './EnumStrapClaspTypeFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema as EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema } from './EnumStrapOriginTypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInputObjectSchema as ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInputObjectSchema } from './ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInput.schema'

const makeSchema = () => z.object({
  claspType: z.union([StrapClaspTypeSchema, z.lazy(() => EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  widthMM: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  originType: z.union([StrapOriginTypeSchema, z.lazy(() => EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  finish: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  minStockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetStockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  ProductVariant: z.lazy(() => ProductVariantUpdateOneRequiredWithoutClaspVariantSpecNestedInputObjectSchema).optional()
}).strict();
export const ClaspVariantSpecUpdateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpdateInput>;
export const ClaspVariantSpecUpdateInputObjectZodSchema = makeSchema();

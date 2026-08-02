import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema as EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema } from './EnumStrapClaspTypeFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema as EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema } from './EnumStrapOriginTypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  variantId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  claspType: z.union([StrapClaspTypeSchema, z.lazy(() => EnumStrapClaspTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  widthMM: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  originType: z.union([StrapOriginTypeSchema, z.lazy(() => EnumStrapOriginTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  brandName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  finish: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  minStockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  targetStockQty: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ClaspVariantSpecUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUncheckedUpdateInput>;
export const ClaspVariantSpecUncheckedUpdateInputObjectZodSchema = makeSchema();

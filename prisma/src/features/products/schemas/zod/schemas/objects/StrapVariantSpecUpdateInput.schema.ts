import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { NullableEnumLengthLabelFieldUpdateOperationsInputObjectSchema as NullableEnumLengthLabelFieldUpdateOperationsInputObjectSchema } from './NullableEnumLengthLabelFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StrapSchema } from '../enums/Strap.schema';
import { EnumStrapFieldUpdateOperationsInputObjectSchema as EnumStrapFieldUpdateOperationsInputObjectSchema } from './EnumStrapFieldUpdateOperationsInput.schema';
import { NullableBoolFieldUpdateOperationsInputObjectSchema as NullableBoolFieldUpdateOperationsInputObjectSchema } from './NullableBoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInputObjectSchema as ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInputObjectSchema } from './ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInput.schema'

const makeSchema = () => z.object({
  widthMM: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  lengthLabel: z.union([LengthLabelSchema, z.lazy(() => NullableEnumLengthLabelFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  material: z.union([StrapSchema, z.lazy(() => EnumStrapFieldUpdateOperationsInputObjectSchema)]).optional(),
  quickRelease: z.union([z.boolean(), z.lazy(() => NullableBoolFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  variant: z.lazy(() => ProductVariantUpdateOneRequiredWithoutStrapSpecNestedInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecUpdateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateInput>;
export const StrapVariantSpecUpdateInputObjectZodSchema = makeSchema();

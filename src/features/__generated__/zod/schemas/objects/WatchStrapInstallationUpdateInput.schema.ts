import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { EnumStrapOwnershipModeFieldUpdateOperationsInputObjectSchema as EnumStrapOwnershipModeFieldUpdateOperationsInputObjectSchema } from './EnumStrapOwnershipModeFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { WatchUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema as WatchUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema } from './WatchUpdateOneRequiredWithoutStrapInstallationsNestedInput.schema';
import { ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema as ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema } from './ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ownershipMode: z.union([StrapOwnershipModeSchema, z.lazy(() => EnumStrapOwnershipModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  installedFullLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  installedHalfLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  spareFullLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  spareHalfLinks: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  endLinkCount: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  wristSizeMM: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  installedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  removedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  installedByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  removedByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sourceOrderId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceRequestId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  watch: z.lazy(() => WatchUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema).optional(),
  strapVariant: z.lazy(() => ProductVariantUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema).optional()
}).strict();
export const WatchStrapInstallationUpdateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateInput>;
export const WatchStrapInstallationUpdateInputObjectZodSchema = makeSchema();

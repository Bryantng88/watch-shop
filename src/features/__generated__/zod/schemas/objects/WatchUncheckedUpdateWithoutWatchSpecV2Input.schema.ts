import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema as EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema } from './EnumWatchSiteChannelFieldUpdateOperationsInput.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumGenderFieldUpdateOperationsInputObjectSchema as EnumGenderFieldUpdateOperationsInputObjectSchema } from './EnumGenderFieldUpdateOperationsInput.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema as NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumMovementTypeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema as EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema } from './EnumWatchSpecStatusFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WatchContentUncheckedUpdateOneWithoutWatchNestedInputObjectSchema as WatchContentUncheckedUpdateOneWithoutWatchNestedInputObjectSchema } from './WatchContentUncheckedUpdateOneWithoutWatchNestedInput.schema';
import { WatchPriceUncheckedUpdateOneWithoutWatchNestedInputObjectSchema as WatchPriceUncheckedUpdateOneWithoutWatchNestedInputObjectSchema } from './WatchPriceUncheckedUpdateOneWithoutWatchNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  legacyVariantId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  stockState: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  saleState: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceState: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  siteChannel: z.union([WatchSiteChannelSchema, z.lazy(() => EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema)]).optional(),
  gender: z.union([GenderSchema, z.lazy(() => EnumGenderFieldUpdateOperationsInputObjectSchema)]).optional(),
  conditionGrade: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementType: z.union([MovementTypeSchema, z.lazy(() => NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementCalibre: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serialNumber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yearText: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  hasBox: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  hasPapers: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  specStatus: z.union([WatchSpecStatusSchema, z.lazy(() => EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  watchContent: z.lazy(() => WatchContentUncheckedUpdateOneWithoutWatchNestedInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceUncheckedUpdateOneWithoutWatchNestedInputObjectSchema).optional()
}).strict();
export const WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema: z.ZodType<Prisma.WatchUncheckedUpdateWithoutWatchSpecV2Input> = makeSchema() as unknown as z.ZodType<Prisma.WatchUncheckedUpdateWithoutWatchSpecV2Input>;
export const WatchUncheckedUpdateWithoutWatchSpecV2InputObjectZodSchema = makeSchema();

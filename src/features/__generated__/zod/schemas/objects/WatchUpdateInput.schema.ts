import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumGenderFieldUpdateOperationsInputObjectSchema as EnumGenderFieldUpdateOperationsInputObjectSchema } from './EnumGenderFieldUpdateOperationsInput.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema as EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema } from './EnumWatchSiteChannelFieldUpdateOperationsInput.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema as NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumMovementTypeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema as ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutWatchNestedInput.schema';
import { WatchContentUpdateOneWithoutWatchNestedInputObjectSchema as WatchContentUpdateOneWithoutWatchNestedInputObjectSchema } from './WatchContentUpdateOneWithoutWatchNestedInput.schema';
import { WatchMediaUpdateManyWithoutWatchNestedInputObjectSchema as WatchMediaUpdateManyWithoutWatchNestedInputObjectSchema } from './WatchMediaUpdateManyWithoutWatchNestedInput.schema';
import { WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema as WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema } from './WatchPriceUpdateOneWithoutWatchNestedInput.schema';
import { WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema as WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema } from './WatchSpecV2UpdateOneWithoutWatchNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  legacyVariantId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  stockState: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  saleState: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceState: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  gender: z.union([GenderSchema, z.lazy(() => EnumGenderFieldUpdateOperationsInputObjectSchema)]).optional(),
  siteChannel: z.union([WatchSiteChannelSchema, z.lazy(() => EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema)]).optional(),
  conditionGrade: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementType: z.union([MovementTypeSchema, z.lazy(() => NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementCalibre: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serialNumber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yearText: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  hasBox: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  hasPapers: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  attachedStrapId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema).optional(),
  watchContent: z.lazy(() => WatchContentUpdateOneWithoutWatchNestedInputObjectSchema).optional(),
  watchMedia: z.lazy(() => WatchMediaUpdateManyWithoutWatchNestedInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema).optional()
}).strict();
export const WatchUpdateInputObjectSchema: z.ZodType<Prisma.WatchUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateInput>;
export const WatchUpdateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { EnumWatchSaleStageFieldUpdateOperationsInputObjectSchema as EnumWatchSaleStageFieldUpdateOperationsInputObjectSchema } from './EnumWatchSaleStageFieldUpdateOperationsInput.schema';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { EnumWatchServiceStageFieldUpdateOperationsInputObjectSchema as EnumWatchServiceStageFieldUpdateOperationsInputObjectSchema } from './EnumWatchServiceStageFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { EnumWatchStockStageFieldUpdateOperationsInputObjectSchema as EnumWatchStockStageFieldUpdateOperationsInputObjectSchema } from './EnumWatchStockStageFieldUpdateOperationsInput.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema as EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema } from './EnumWatchSiteChannelFieldUpdateOperationsInput.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumGenderFieldUpdateOperationsInputObjectSchema as EnumGenderFieldUpdateOperationsInputObjectSchema } from './EnumGenderFieldUpdateOperationsInput.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema as EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema } from './EnumAudienceSegmentFieldUpdateOperationsInput.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { EnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema as EnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema } from './EnumMediaPipelineKeyFieldUpdateOperationsInput.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema as NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumMovementTypeFieldUpdateOperationsInput.schema';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { NullableEnumWatchStyleFieldUpdateOperationsInputObjectSchema as NullableEnumWatchStyleFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchStyleFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema as EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema } from './EnumWatchSpecStatusFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema as ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutWatchNestedInput.schema';
import { WatchContentUpdateOneWithoutWatchNestedInputObjectSchema as WatchContentUpdateOneWithoutWatchNestedInputObjectSchema } from './WatchContentUpdateOneWithoutWatchNestedInput.schema';
import { WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema as WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema } from './WatchPriceUpdateOneWithoutWatchNestedInput.schema';
import { WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema as WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema } from './WatchSpecV2UpdateOneWithoutWatchNestedInput.schema';
import { TaskUpdateManyWithoutWatchNestedInputObjectSchema as TaskUpdateManyWithoutWatchNestedInputObjectSchema } from './TaskUpdateManyWithoutWatchNestedInput.schema';
import { WorkCaseUpdateManyWithoutWatchNestedInputObjectSchema as WorkCaseUpdateManyWithoutWatchNestedInputObjectSchema } from './WorkCaseUpdateManyWithoutWatchNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  legacyVariantId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  saleStage: z.union([WatchSaleStageSchema, z.lazy(() => EnumWatchSaleStageFieldUpdateOperationsInputObjectSchema)]).optional(),
  serviceStage: z.union([WatchServiceStageSchema, z.lazy(() => EnumWatchServiceStageFieldUpdateOperationsInputObjectSchema)]).optional(),
  serviceExpectedWorkingDays: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceExpectedCompletionAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  stockStage: z.union([WatchStockStageSchema, z.lazy(() => EnumWatchStockStageFieldUpdateOperationsInputObjectSchema)]).optional(),
  siteChannel: z.union([WatchSiteChannelSchema, z.lazy(() => EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema)]).optional(),
  gender: z.union([GenderSchema, z.lazy(() => EnumGenderFieldUpdateOperationsInputObjectSchema)]).optional(),
  audienceSegment: z.union([AudienceSegmentSchema, z.lazy(() => EnumAudienceSegmentFieldUpdateOperationsInputObjectSchema)]).optional(),
  mediaPipelineKey: z.union([MediaPipelineKeySchema, z.lazy(() => EnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema)]).optional(),
  conditionGrade: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementType: z.union([MovementTypeSchema, z.lazy(() => NullableEnumMovementTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  movementCalibre: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serialNumber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yearText: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  style: z.union([WatchStyleSchema, z.lazy(() => NullableEnumWatchStyleFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  hasBox: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  hasPapers: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  specStatus: z.union([WatchSpecStatusSchema, z.lazy(() => EnumWatchSpecStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  isImageDownloaded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  isContentDownloaded: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  duplicateConfirmedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  duplicateConfirmedByUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema).optional(),
  watchContent: z.lazy(() => WatchContentUpdateOneWithoutWatchNestedInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutWatchNestedInputObjectSchema).optional(),
  workCases: z.lazy(() => WorkCaseUpdateManyWithoutWatchNestedInputObjectSchema).optional()
}).strict();
export const WatchUpdateWithoutReviewStatesInputObjectSchema: z.ZodType<Prisma.WatchUpdateWithoutReviewStatesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateWithoutReviewStatesInput>;
export const WatchUpdateWithoutReviewStatesInputObjectZodSchema = makeSchema();

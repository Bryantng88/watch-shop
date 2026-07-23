import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { WatchContentUncheckedCreateNestedOneWithoutWatchInputObjectSchema as WatchContentUncheckedCreateNestedOneWithoutWatchInputObjectSchema } from './WatchContentUncheckedCreateNestedOneWithoutWatchInput.schema';
import { WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema as WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema } from './WatchPriceUncheckedCreateNestedOneWithoutWatchInput.schema';
import { WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema as WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedCreateNestedOneWithoutWatchInput.schema';
import { WatchReviewStateUncheckedCreateNestedManyWithoutWatchInputObjectSchema as WatchReviewStateUncheckedCreateNestedManyWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedCreateNestedManyWithoutWatchInput.schema';
import { TaskUncheckedCreateNestedManyWithoutWatchInputObjectSchema as TaskUncheckedCreateNestedManyWithoutWatchInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutWatchInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutWatchInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutWatchInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyVariantId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  saleStage: WatchSaleStageSchema.optional(),
  serviceStage: WatchServiceStageSchema.optional(),
  stockStage: WatchStockStageSchema.optional(),
  siteChannel: WatchSiteChannelSchema.optional(),
  gender: GenderSchema.optional(),
  audienceSegment: AudienceSegmentSchema.optional(),
  mediaPipelineKey: MediaPipelineKeySchema.optional(),
  conditionGrade: z.string().optional().nullable(),
  movementType: MovementTypeSchema.optional().nullable(),
  movementCalibre: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  yearText: z.string().optional().nullable(),
  style: WatchStyleSchema.optional().nullable(),
  hasBox: z.boolean().optional(),
  hasPapers: z.boolean().optional(),
  specStatus: WatchSpecStatusSchema.optional(),
  isImageDownloaded: z.boolean().optional(),
  isContentDownloaded: z.boolean().optional(),
  notes: z.string().optional().nullable(),
  duplicateConfirmedAt: z.coerce.date().optional().nullable(),
  duplicateConfirmedByUserId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  watchContent: z.lazy(() => WatchContentUncheckedCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  reviewStates: z.lazy(() => WatchReviewStateUncheckedCreateNestedManyWithoutWatchInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutWatchInputObjectSchema).optional(),
  workCases: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutWatchInputObjectSchema).optional()
}).strict();
export const WatchUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUncheckedCreateWithoutProductInput>;
export const WatchUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();

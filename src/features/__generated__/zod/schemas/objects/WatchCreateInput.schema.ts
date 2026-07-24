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
import { ProductCreateNestedOneWithoutWatchInputObjectSchema as ProductCreateNestedOneWithoutWatchInputObjectSchema } from './ProductCreateNestedOneWithoutWatchInput.schema';
import { WatchContentCreateNestedOneWithoutWatchInputObjectSchema as WatchContentCreateNestedOneWithoutWatchInputObjectSchema } from './WatchContentCreateNestedOneWithoutWatchInput.schema';
import { WatchPriceCreateNestedOneWithoutWatchInputObjectSchema as WatchPriceCreateNestedOneWithoutWatchInputObjectSchema } from './WatchPriceCreateNestedOneWithoutWatchInput.schema';
import { WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema as WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema } from './WatchSpecV2CreateNestedOneWithoutWatchInput.schema';
import { WatchReviewStateCreateNestedManyWithoutWatchInputObjectSchema as WatchReviewStateCreateNestedManyWithoutWatchInputObjectSchema } from './WatchReviewStateCreateNestedManyWithoutWatchInput.schema';
import { TaskCreateNestedManyWithoutWatchInputObjectSchema as TaskCreateNestedManyWithoutWatchInputObjectSchema } from './TaskCreateNestedManyWithoutWatchInput.schema';
import { WorkCaseCreateNestedManyWithoutWatchInputObjectSchema as WorkCaseCreateNestedManyWithoutWatchInputObjectSchema } from './WorkCaseCreateNestedManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyVariantId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  saleStage: WatchSaleStageSchema.optional(),
  serviceStage: WatchServiceStageSchema.optional(),
  serviceExpectedWorkingDays: z.number().int().optional().nullable(),
  serviceExpectedCompletionAt: z.coerce.date().optional().nullable(),
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
  product: z.lazy(() => ProductCreateNestedOneWithoutWatchInputObjectSchema),
  watchContent: z.lazy(() => WatchContentCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceCreateNestedOneWithoutWatchInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2CreateNestedOneWithoutWatchInputObjectSchema).optional(),
  reviewStates: z.lazy(() => WatchReviewStateCreateNestedManyWithoutWatchInputObjectSchema),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutWatchInputObjectSchema),
  workCases: z.lazy(() => WorkCaseCreateNestedManyWithoutWatchInputObjectSchema)
}).strict();
export const WatchCreateInputObjectSchema: z.ZodType<Prisma.WatchCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateInput>;
export const WatchCreateInputObjectZodSchema = makeSchema();

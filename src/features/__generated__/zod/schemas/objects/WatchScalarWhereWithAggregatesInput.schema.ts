import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumWatchSaleStageWithAggregatesFilterObjectSchema as EnumWatchSaleStageWithAggregatesFilterObjectSchema } from './EnumWatchSaleStageWithAggregatesFilter.schema';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { EnumWatchServiceStageWithAggregatesFilterObjectSchema as EnumWatchServiceStageWithAggregatesFilterObjectSchema } from './EnumWatchServiceStageWithAggregatesFilter.schema';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { EnumWatchStockStageWithAggregatesFilterObjectSchema as EnumWatchStockStageWithAggregatesFilterObjectSchema } from './EnumWatchStockStageWithAggregatesFilter.schema';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { EnumWatchSiteChannelWithAggregatesFilterObjectSchema as EnumWatchSiteChannelWithAggregatesFilterObjectSchema } from './EnumWatchSiteChannelWithAggregatesFilter.schema';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { EnumGenderWithAggregatesFilterObjectSchema as EnumGenderWithAggregatesFilterObjectSchema } from './EnumGenderWithAggregatesFilter.schema';
import { GenderSchema } from '../enums/Gender.schema';
import { EnumAudienceSegmentWithAggregatesFilterObjectSchema as EnumAudienceSegmentWithAggregatesFilterObjectSchema } from './EnumAudienceSegmentWithAggregatesFilter.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { EnumMediaPipelineKeyWithAggregatesFilterObjectSchema as EnumMediaPipelineKeyWithAggregatesFilterObjectSchema } from './EnumMediaPipelineKeyWithAggregatesFilter.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { EnumMovementTypeNullableWithAggregatesFilterObjectSchema as EnumMovementTypeNullableWithAggregatesFilterObjectSchema } from './EnumMovementTypeNullableWithAggregatesFilter.schema';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { EnumWatchStyleNullableWithAggregatesFilterObjectSchema as EnumWatchStyleNullableWithAggregatesFilterObjectSchema } from './EnumWatchStyleNullableWithAggregatesFilter.schema';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { EnumWatchSpecStatusWithAggregatesFilterObjectSchema as EnumWatchSpecStatusWithAggregatesFilterObjectSchema } from './EnumWatchSpecStatusWithAggregatesFilter.schema';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const watchscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  legacyVariantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  saleStage: z.union([z.lazy(() => EnumWatchSaleStageWithAggregatesFilterObjectSchema), WatchSaleStageSchema]).optional(),
  serviceStage: z.union([z.lazy(() => EnumWatchServiceStageWithAggregatesFilterObjectSchema), WatchServiceStageSchema]).optional(),
  stockStage: z.union([z.lazy(() => EnumWatchStockStageWithAggregatesFilterObjectSchema), WatchStockStageSchema]).optional(),
  siteChannel: z.union([z.lazy(() => EnumWatchSiteChannelWithAggregatesFilterObjectSchema), WatchSiteChannelSchema]).optional(),
  gender: z.union([z.lazy(() => EnumGenderWithAggregatesFilterObjectSchema), GenderSchema]).optional(),
  audienceSegment: z.union([z.lazy(() => EnumAudienceSegmentWithAggregatesFilterObjectSchema), AudienceSegmentSchema]).optional(),
  mediaPipelineKey: z.union([z.lazy(() => EnumMediaPipelineKeyWithAggregatesFilterObjectSchema), MediaPipelineKeySchema]).optional(),
  conditionGrade: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  movementType: z.union([z.lazy(() => EnumMovementTypeNullableWithAggregatesFilterObjectSchema), MovementTypeSchema]).optional().nullable(),
  movementCalibre: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serialNumber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  yearText: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  style: z.union([z.lazy(() => EnumWatchStyleNullableWithAggregatesFilterObjectSchema), WatchStyleSchema]).optional().nullable(),
  hasBox: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  hasPapers: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  specStatus: z.union([z.lazy(() => EnumWatchSpecStatusWithAggregatesFilterObjectSchema), WatchSpecStatusSchema]).optional(),
  isImageDownloaded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  isContentDownloaded: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  duplicateConfirmedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  duplicateConfirmedByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchScalarWhereWithAggregatesInput> = watchscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchScalarWhereWithAggregatesInput>;
export const WatchScalarWhereWithAggregatesInputObjectZodSchema = watchscalarwherewithaggregatesinputSchema;

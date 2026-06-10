import * as z from 'zod';

import { WatchSaleStageSchema } from '../../enums/WatchSaleStage.schema';
import { WatchServiceStageSchema } from '../../enums/WatchServiceStage.schema';
import { WatchStockStageSchema } from '../../enums/WatchStockStage.schema';
import { WatchSiteChannelSchema } from '../../enums/WatchSiteChannel.schema';
import { GenderSchema } from '../../enums/Gender.schema';
import { MovementTypeSchema } from '../../enums/MovementType.schema';
import { WatchStyleSchema } from '../../enums/WatchStyle.schema';
import { WatchSpecStatusSchema } from '../../enums/WatchSpecStatus.schema';
// prettier-ignore
export const WatchInputSchema = z.object({
    id: z.string(),
    productId: z.string(),
    legacyVariantId: z.string().optional().nullable(),
    acquisitionId: z.string().optional().nullable(),
    saleStage: WatchSaleStageSchema,
    serviceStage: WatchServiceStageSchema,
    stockStage: WatchStockStageSchema,
    siteChannel: WatchSiteChannelSchema,
    gender: GenderSchema,
    conditionGrade: z.string().optional().nullable(),
    movementType: MovementTypeSchema.optional().nullable(),
    movementCalibre: z.string().optional().nullable(),
    serialNumber: z.string().optional().nullable(),
    yearText: z.string().optional().nullable(),
    style: WatchStyleSchema.optional().nullable(),
    hasBox: z.boolean(),
    hasPapers: z.boolean(),
    specStatus: WatchSpecStatusSchema,
    isImageDownloaded: z.boolean(),
    isContentDownloaded: z.boolean(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown(),
    watchContent: z.unknown().optional().nullable(),
    watchPrice: z.unknown().optional().nullable(),
    watchSpecV2: z.unknown().optional().nullable(),
    reviewStates: z.array(z.unknown()),
    tasks: z.array(z.unknown()),
    workCases: z.array(z.unknown())
}).strict();

export type WatchInputType = z.infer<typeof WatchInputSchema>;

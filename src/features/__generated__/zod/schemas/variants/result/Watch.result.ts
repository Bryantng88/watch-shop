import * as z from 'zod';

import { GenderSchema } from '../../enums/Gender.schema';
import { WatchSiteChannelSchema } from '../../enums/WatchSiteChannel.schema';
import { MovementTypeSchema } from '../../enums/MovementType.schema';
// prettier-ignore
export const WatchResultSchema = z.object({
    id: z.string(),
    productId: z.string(),
    legacyVariantId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    stockState: z.string().nullable(),
    saleState: z.string().nullable(),
    serviceState: z.string().nullable(),
    gender: GenderSchema,
    siteChannel: WatchSiteChannelSchema,
    conditionGrade: z.string().nullable(),
    movementType: MovementTypeSchema.nullable(),
    movementCalibre: z.string().nullable(),
    serialNumber: z.string().nullable(),
    yearText: z.string().nullable(),
    hasBox: z.boolean(),
    hasPapers: z.boolean(),
    attachedStrapId: z.string().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown(),
    watchContent: z.unknown().nullable(),
    watchMedia: z.array(z.unknown()),
    watchPrice: z.unknown().nullable(),
    watchSpecV2: z.unknown().nullable()
}).strict();

export type WatchResultType = z.infer<typeof WatchResultSchema>;

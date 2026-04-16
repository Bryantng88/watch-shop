import * as z from 'zod';

import { GenderSchema } from '../../enums/Gender.schema';
import { WatchSiteChannelSchema } from '../../enums/WatchSiteChannel.schema';
import { MovementTypeSchema } from '../../enums/MovementType.schema';
// prettier-ignore
export const WatchInputSchema = z.object({
    id: z.string(),
    productId: z.string(),
    legacyVariantId: z.string().optional().nullable(),
    acquisitionId: z.string().optional().nullable(),
    stockState: z.string().optional().nullable(),
    saleState: z.string().optional().nullable(),
    serviceState: z.string().optional().nullable(),
    gender: GenderSchema,
    siteChannel: WatchSiteChannelSchema,
    conditionGrade: z.string().optional().nullable(),
    movementType: MovementTypeSchema.optional().nullable(),
    movementCalibre: z.string().optional().nullable(),
    serialNumber: z.string().optional().nullable(),
    yearText: z.string().optional().nullable(),
    hasBox: z.boolean(),
    hasPapers: z.boolean(),
    attachedStrapId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown(),
    watchContent: z.unknown().optional().nullable(),
    watchMedia: z.array(z.unknown()),
    watchPrice: z.unknown().optional().nullable(),
    watchSpecV2: z.unknown().optional().nullable()
}).strict();

export type WatchInputType = z.infer<typeof WatchInputSchema>;

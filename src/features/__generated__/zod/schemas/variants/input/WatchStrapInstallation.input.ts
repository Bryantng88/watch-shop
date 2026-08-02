import * as z from 'zod';

import { StrapOwnershipModeSchema } from '../../enums/StrapOwnershipMode.schema';
// prettier-ignore
export const WatchStrapInstallationInputSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    strapVariantId: z.string(),
    ownershipMode: StrapOwnershipModeSchema,
    installedFullLinks: z.number().int().optional().nullable(),
    installedHalfLinks: z.number().int().optional().nullable(),
    spareFullLinks: z.number().int().optional().nullable(),
    spareHalfLinks: z.number().int().optional().nullable(),
    endLinkCount: z.number().int().optional().nullable(),
    wristSizeMM: z.number().int().optional().nullable(),
    installedAt: z.date(),
    removedAt: z.date().optional().nullable(),
    installedByUserId: z.string().optional().nullable(),
    removedByUserId: z.string().optional().nullable(),
    sourceOrderId: z.string().optional().nullable(),
    serviceRequestId: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    watch: z.unknown(),
    strapVariant: z.unknown()
}).strict();

export type WatchStrapInstallationInputType = z.infer<typeof WatchStrapInstallationInputSchema>;

import * as z from 'zod';

export const WatchStrapInstallationScalarFieldEnumSchema = z.enum(['id', 'watchId', 'strapVariantId', 'ownershipMode', 'installedFullLinks', 'installedHalfLinks', 'spareFullLinks', 'spareHalfLinks', 'endLinkCount', 'wristSizeMM', 'installedAt', 'removedAt', 'installedByUserId', 'removedByUserId', 'sourceOrderId', 'serviceRequestId', 'note'])

export type WatchStrapInstallationScalarFieldEnum = z.infer<typeof WatchStrapInstallationScalarFieldEnumSchema>;
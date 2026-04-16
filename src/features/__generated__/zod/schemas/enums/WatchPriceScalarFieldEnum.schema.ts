import * as z from 'zod';

export const WatchPriceScalarFieldEnumSchema = z.enum(['id', 'watchId', 'costPrice', 'serviceCost', 'landedCost', 'listPrice', 'salePrice', 'minPrice', 'pricingNote', 'createdAt', 'updatedAt'])

export type WatchPriceScalarFieldEnum = z.infer<typeof WatchPriceScalarFieldEnumSchema>;
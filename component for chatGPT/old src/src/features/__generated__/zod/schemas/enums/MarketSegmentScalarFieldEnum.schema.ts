import * as z from 'zod';

export const MarketSegmentScalarFieldEnumSchema = z.enum(['id', 'name'])

export type MarketSegmentScalarFieldEnum = z.infer<typeof MarketSegmentScalarFieldEnumSchema>;
import * as z from 'zod';

export const ServiceScopeSchema = z.enum(['WITH_PURCHASE', 'CUSTOMER_OWNED', 'INTERNAL'])

export type ServiceScope = z.infer<typeof ServiceScopeSchema>;
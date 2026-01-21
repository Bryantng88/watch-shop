import * as z from 'zod';

export const service_scopeSchema = z.enum(['WITH_PURCHASE', 'CUSTOMER_OWNED'])

export type service_scope = z.infer<typeof service_scopeSchema>;
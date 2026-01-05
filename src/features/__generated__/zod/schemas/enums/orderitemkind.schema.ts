import * as z from 'zod';

export const orderitemkindSchema = z.enum(['PRODUCT', 'SERVICE', 'DISCOUNT'])

export type orderitemkind = z.infer<typeof orderitemkindSchema>;
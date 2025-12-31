import * as z from 'zod';

export const orderitemkindSchema = z.enum(['PRODUCT', 'SERVICE'])

export type orderitemkind = z.infer<typeof orderitemkindSchema>;
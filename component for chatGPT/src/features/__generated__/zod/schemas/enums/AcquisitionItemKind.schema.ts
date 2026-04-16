import * as z from 'zod';

export const AcquisitionItemKindSchema = z.enum(['PRODUCT', 'SERVICE', 'FEE'])

export type AcquisitionItemKind = z.infer<typeof AcquisitionItemKindSchema>;
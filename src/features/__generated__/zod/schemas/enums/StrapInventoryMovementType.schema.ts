import * as z from 'zod';

export const StrapInventoryMovementTypeSchema = z.enum(['RECEIPT', 'SALE', 'INSTALL', 'REMOVE', 'ADJUST', 'RETURN', 'TRANSFER'])

export type StrapInventoryMovementType = z.infer<typeof StrapInventoryMovementTypeSchema>;
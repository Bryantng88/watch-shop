import * as z from 'zod';

export const BankScalarFieldEnumSchema = z.enum(['id', 'created_at', 'bankName'])

export type BankScalarFieldEnum = z.infer<typeof BankScalarFieldEnumSchema>;
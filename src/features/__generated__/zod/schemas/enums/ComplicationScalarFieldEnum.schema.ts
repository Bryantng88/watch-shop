import * as z from 'zod';

export const ComplicationScalarFieldEnumSchema = z.enum(['id', 'name'])

export type ComplicationScalarFieldEnum = z.infer<typeof ComplicationScalarFieldEnumSchema>;
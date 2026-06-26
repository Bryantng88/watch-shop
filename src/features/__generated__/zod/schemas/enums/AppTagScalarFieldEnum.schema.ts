import * as z from 'zod';

export const AppTagScalarFieldEnumSchema = z.enum(['id', 'name', 'slug', 'color', 'scope', 'ownerType', 'ownerId', 'createdAt', 'updatedAt'])

export type AppTagScalarFieldEnum = z.infer<typeof AppTagScalarFieldEnumSchema>;
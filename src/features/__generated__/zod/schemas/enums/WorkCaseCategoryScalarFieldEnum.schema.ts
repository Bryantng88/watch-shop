import * as z from 'zod';

export const WorkCaseCategoryScalarFieldEnumSchema = z.enum(['id', 'code', 'name', 'description', 'scope', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type WorkCaseCategoryScalarFieldEnum = z.infer<typeof WorkCaseCategoryScalarFieldEnumSchema>;
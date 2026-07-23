import * as z from 'zod';

export const MediaBindingLifecycleSchema = z.enum(['DRAFT', 'SELECTED', 'ATTACHED', 'APPROVED', 'PUBLISHED', 'REMOVED'])

export type MediaBindingLifecycle = z.infer<typeof MediaBindingLifecycleSchema>;
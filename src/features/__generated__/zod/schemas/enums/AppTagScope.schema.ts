import * as z from 'zod';

export const AppTagScopeSchema = z.enum(['GLOBAL', 'OWNER'])

export type AppTagScope = z.infer<typeof AppTagScopeSchema>;
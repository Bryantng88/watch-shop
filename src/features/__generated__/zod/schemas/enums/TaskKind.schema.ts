import * as z from 'zod';

export const TaskKindSchema = z.enum(['BUSINESS', 'OPERATION', 'SERVICE', 'PERSONAL', 'FREE'])

export type TaskKind = z.infer<typeof TaskKindSchema>;
import * as z from 'zod';

export const TaskKindSchema = z.enum(['PERSONAL', 'BUSINESS'])

export type TaskKind = z.infer<typeof TaskKindSchema>;
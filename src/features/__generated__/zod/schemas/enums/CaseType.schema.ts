import * as z from 'zod';

export const CaseTypeSchema = z.enum(['ROUND', 'TANK', 'SQUARE', 'SPECIAL', 'OTHER', 'TONNEAU', 'CUSHION', 'OVAL', 'ASYMMETRICAL', 'OCTAGON', 'POLYGON'])

export type CaseType = z.infer<typeof CaseTypeSchema>;
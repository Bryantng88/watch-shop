import * as z from 'zod';

export const WorkCaseScopeSchema = z.enum(['BUSINESS', 'SERVICE', 'PAYMENT', 'LOGISTIC', 'OTHER'])

export type WorkCaseScope = z.infer<typeof WorkCaseScopeSchema>;
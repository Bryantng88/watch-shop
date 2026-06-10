import * as z from 'zod';

import { WorkCaseScopeSchema } from '../../enums/WorkCaseScope.schema';
// prettier-ignore
export const WorkCaseCategoryModelSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    scope: WorkCaseScopeSchema,
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    workCases: z.array(z.unknown())
}).strict();

export type WorkCaseCategoryPureType = z.infer<typeof WorkCaseCategoryModelSchema>;

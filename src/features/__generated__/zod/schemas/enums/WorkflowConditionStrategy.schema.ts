import * as z from 'zod';

export const WorkflowConditionStrategySchema = z.enum(['ALL', 'ANY'])

export type WorkflowConditionStrategy = z.infer<typeof WorkflowConditionStrategySchema>;
import * as z from 'zod';
export const TaskExecutionCreateManyResultSchema = z.object({
  count: z.number()
});
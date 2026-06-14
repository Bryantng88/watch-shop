import * as z from 'zod';
export const TaskActionCreateManyResultSchema = z.object({
  count: z.number()
});
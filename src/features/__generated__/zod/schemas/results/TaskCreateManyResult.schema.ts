import * as z from 'zod';
export const TaskCreateManyResultSchema = z.object({
  count: z.number()
});
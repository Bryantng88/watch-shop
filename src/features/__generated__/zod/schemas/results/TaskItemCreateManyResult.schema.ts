import * as z from 'zod';
export const TaskItemCreateManyResultSchema = z.object({
  count: z.number()
});
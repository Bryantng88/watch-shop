import * as z from 'zod';
export const TaskItemDeleteManyResultSchema = z.object({
  count: z.number()
});
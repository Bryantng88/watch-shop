import * as z from 'zod';
export const TaskActionDeleteManyResultSchema = z.object({
  count: z.number()
});
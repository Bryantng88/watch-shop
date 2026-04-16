import * as z from 'zod';
export const ComplicationCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  WatchSpec: z.array(z.unknown())
});
import * as z from 'zod';
export const ComplicationUpsertResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  WatchSpec: z.array(z.unknown())
});
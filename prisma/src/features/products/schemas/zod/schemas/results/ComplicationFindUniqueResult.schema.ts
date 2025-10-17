import * as z from 'zod';
export const ComplicationFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  watchSpecs: z.array(z.unknown())
}));
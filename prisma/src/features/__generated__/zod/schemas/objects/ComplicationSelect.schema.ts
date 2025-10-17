import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecFindManySchema as WatchSpecFindManySchema } from '../findManyWatchSpec.schema';
import { ComplicationCountOutputTypeArgsObjectSchema as ComplicationCountOutputTypeArgsObjectSchema } from './ComplicationCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  watchSpecs: z.union([z.boolean(), z.lazy(() => WatchSpecFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ComplicationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ComplicationSelectObjectSchema: z.ZodType<Prisma.ComplicationSelect> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationSelect>;
export const ComplicationSelectObjectZodSchema = makeSchema();

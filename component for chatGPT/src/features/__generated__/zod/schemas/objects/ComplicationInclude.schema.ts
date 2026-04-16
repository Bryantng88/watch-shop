import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecFindManySchema as WatchSpecFindManySchema } from '../findManyWatchSpec.schema';
import { ComplicationCountOutputTypeArgsObjectSchema as ComplicationCountOutputTypeArgsObjectSchema } from './ComplicationCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  watchSpecs: z.union([z.boolean(), z.lazy(() => WatchSpecFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ComplicationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ComplicationIncludeObjectSchema: z.ZodType<Prisma.ComplicationInclude> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationInclude>;
export const ComplicationIncludeObjectZodSchema = makeSchema();

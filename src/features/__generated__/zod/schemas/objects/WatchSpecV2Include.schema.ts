import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchSpecV2IncludeObjectSchema: z.ZodType<Prisma.WatchSpecV2Include> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2Include>;
export const WatchSpecV2IncludeObjectZodSchema = makeSchema();

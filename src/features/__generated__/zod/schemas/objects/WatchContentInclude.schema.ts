import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchContentIncludeObjectSchema: z.ZodType<Prisma.WatchContentInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentInclude>;
export const WatchContentIncludeObjectZodSchema = makeSchema();

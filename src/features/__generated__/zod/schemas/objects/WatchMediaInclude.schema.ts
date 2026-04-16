import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchMediaIncludeObjectSchema: z.ZodType<Prisma.WatchMediaInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaInclude>;
export const WatchMediaIncludeObjectZodSchema = makeSchema();

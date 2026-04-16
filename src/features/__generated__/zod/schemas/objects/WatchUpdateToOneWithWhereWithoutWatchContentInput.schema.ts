import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutWatchContentInputObjectSchema as WatchUpdateWithoutWatchContentInputObjectSchema } from './WatchUpdateWithoutWatchContentInput.schema';
import { WatchUncheckedUpdateWithoutWatchContentInputObjectSchema as WatchUncheckedUpdateWithoutWatchContentInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchContentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchContentInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutWatchContentInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchContentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchContentInput>;
export const WatchUpdateToOneWithWhereWithoutWatchContentInputObjectZodSchema = makeSchema();

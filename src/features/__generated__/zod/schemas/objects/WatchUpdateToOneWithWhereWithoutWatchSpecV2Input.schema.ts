import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutWatchSpecV2InputObjectSchema as WatchUpdateWithoutWatchSpecV2InputObjectSchema } from './WatchUpdateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedUpdateWithoutWatchSpecV2Input.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutWatchSpecV2InputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchSpecV2Input> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchSpecV2Input>;
export const WatchUpdateToOneWithWhereWithoutWatchSpecV2InputObjectZodSchema = makeSchema();

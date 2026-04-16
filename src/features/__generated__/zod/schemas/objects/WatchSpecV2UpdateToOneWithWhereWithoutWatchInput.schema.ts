import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './WatchSpecV2WhereInput.schema';
import { WatchSpecV2UpdateWithoutWatchInputObjectSchema as WatchSpecV2UpdateWithoutWatchInputObjectSchema } from './WatchSpecV2UpdateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecV2WhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchSpecV2UpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchSpecV2UpdateToOneWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UpdateToOneWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UpdateToOneWithWhereWithoutWatchInput>;
export const WatchSpecV2UpdateToOneWithWhereWithoutWatchInputObjectZodSchema = makeSchema();

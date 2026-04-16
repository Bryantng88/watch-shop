import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './WatchContentWhereInput.schema';
import { WatchContentUpdateWithoutWatchInputObjectSchema as WatchContentUpdateWithoutWatchInputObjectSchema } from './WatchContentUpdateWithoutWatchInput.schema';
import { WatchContentUncheckedUpdateWithoutWatchInputObjectSchema as WatchContentUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchContentUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchContentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchContentUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchContentUpdateToOneWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchContentUpdateToOneWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentUpdateToOneWithWhereWithoutWatchInput>;
export const WatchContentUpdateToOneWithWhereWithoutWatchInputObjectZodSchema = makeSchema();

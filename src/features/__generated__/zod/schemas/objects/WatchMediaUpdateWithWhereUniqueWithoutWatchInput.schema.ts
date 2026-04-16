import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './WatchMediaWhereUniqueInput.schema';
import { WatchMediaUpdateWithoutWatchInputObjectSchema as WatchMediaUpdateWithoutWatchInputObjectSchema } from './WatchMediaUpdateWithoutWatchInput.schema';
import { WatchMediaUncheckedUpdateWithoutWatchInputObjectSchema as WatchMediaUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchMediaUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchMediaWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchMediaUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchMediaUpdateWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchMediaUpdateWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaUpdateWithWhereUniqueWithoutWatchInput>;
export const WatchMediaUpdateWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();

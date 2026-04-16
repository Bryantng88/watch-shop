import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutWatchMediaInputObjectSchema as WatchUpdateWithoutWatchMediaInputObjectSchema } from './WatchUpdateWithoutWatchMediaInput.schema';
import { WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema as WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchMediaInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutWatchMediaInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchMediaInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchMediaInput>;
export const WatchUpdateToOneWithWhereWithoutWatchMediaInputObjectZodSchema = makeSchema();

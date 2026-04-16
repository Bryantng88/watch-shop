import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchContentInputObjectSchema as WatchCreateWithoutWatchContentInputObjectSchema } from './WatchCreateWithoutWatchContentInput.schema';
import { WatchUncheckedCreateWithoutWatchContentInputObjectSchema as WatchUncheckedCreateWithoutWatchContentInputObjectSchema } from './WatchUncheckedCreateWithoutWatchContentInput.schema';
import { WatchCreateOrConnectWithoutWatchContentInputObjectSchema as WatchCreateOrConnectWithoutWatchContentInputObjectSchema } from './WatchCreateOrConnectWithoutWatchContentInput.schema';
import { WatchUpsertWithoutWatchContentInputObjectSchema as WatchUpsertWithoutWatchContentInputObjectSchema } from './WatchUpsertWithoutWatchContentInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutWatchContentInputObjectSchema as WatchUpdateToOneWithWhereWithoutWatchContentInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutWatchContentInput.schema';
import { WatchUpdateWithoutWatchContentInputObjectSchema as WatchUpdateWithoutWatchContentInputObjectSchema } from './WatchUpdateWithoutWatchContentInput.schema';
import { WatchUncheckedUpdateWithoutWatchContentInputObjectSchema as WatchUncheckedUpdateWithoutWatchContentInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchContentInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchContentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchContentInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutWatchContentInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUpdateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchContentInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutWatchContentNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchContentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchContentNestedInput>;
export const WatchUpdateOneRequiredWithoutWatchContentNestedInputObjectZodSchema = makeSchema();

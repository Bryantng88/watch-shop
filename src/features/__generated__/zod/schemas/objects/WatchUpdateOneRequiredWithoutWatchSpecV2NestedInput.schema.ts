import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchSpecV2InputObjectSchema as WatchCreateWithoutWatchSpecV2InputObjectSchema } from './WatchCreateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedCreateWithoutWatchSpecV2Input.schema';
import { WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema as WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema } from './WatchCreateOrConnectWithoutWatchSpecV2Input.schema';
import { WatchUpsertWithoutWatchSpecV2InputObjectSchema as WatchUpsertWithoutWatchSpecV2InputObjectSchema } from './WatchUpsertWithoutWatchSpecV2Input.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutWatchSpecV2InputObjectSchema as WatchUpdateToOneWithWhereWithoutWatchSpecV2InputObjectSchema } from './WatchUpdateToOneWithWhereWithoutWatchSpecV2Input.schema';
import { WatchUpdateWithoutWatchSpecV2InputObjectSchema as WatchUpdateWithoutWatchSpecV2InputObjectSchema } from './WatchUpdateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedUpdateWithoutWatchSpecV2Input.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutWatchSpecV2InputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUpdateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutWatchSpecV2NestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchSpecV2NestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchSpecV2NestedInput>;
export const WatchUpdateOneRequiredWithoutWatchSpecV2NestedInputObjectZodSchema = makeSchema();

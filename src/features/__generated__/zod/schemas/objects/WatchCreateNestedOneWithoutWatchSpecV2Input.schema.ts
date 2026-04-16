import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchSpecV2InputObjectSchema as WatchCreateWithoutWatchSpecV2InputObjectSchema } from './WatchCreateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedCreateWithoutWatchSpecV2Input.schema';
import { WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema as WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema } from './WatchCreateOrConnectWithoutWatchSpecV2Input.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutWatchSpecV2InputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchSpecV2Input> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchSpecV2Input>;
export const WatchCreateNestedOneWithoutWatchSpecV2InputObjectZodSchema = makeSchema();

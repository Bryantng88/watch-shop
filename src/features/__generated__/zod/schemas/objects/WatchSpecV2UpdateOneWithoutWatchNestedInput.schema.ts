import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2CreateWithoutWatchInputObjectSchema as WatchSpecV2CreateWithoutWatchInputObjectSchema } from './WatchSpecV2CreateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedCreateWithoutWatchInput.schema';
import { WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema as WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema } from './WatchSpecV2CreateOrConnectWithoutWatchInput.schema';
import { WatchSpecV2UpsertWithoutWatchInputObjectSchema as WatchSpecV2UpsertWithoutWatchInputObjectSchema } from './WatchSpecV2UpsertWithoutWatchInput.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './WatchSpecV2WhereInput.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './WatchSpecV2WhereUniqueInput.schema';
import { WatchSpecV2UpdateToOneWithWhereWithoutWatchInputObjectSchema as WatchSpecV2UpdateToOneWithWhereWithoutWatchInputObjectSchema } from './WatchSpecV2UpdateToOneWithWhereWithoutWatchInput.schema';
import { WatchSpecV2UpdateWithoutWatchInputObjectSchema as WatchSpecV2UpdateWithoutWatchInputObjectSchema } from './WatchSpecV2UpdateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecV2CreateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchSpecV2UpsertWithoutWatchInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchSpecV2WhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchSpecV2WhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchSpecV2WhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchSpecV2UpdateToOneWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema)]).optional()
}).strict();
export const WatchSpecV2UpdateOneWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UpdateOneWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UpdateOneWithoutWatchNestedInput>;
export const WatchSpecV2UpdateOneWithoutWatchNestedInputObjectZodSchema = makeSchema();

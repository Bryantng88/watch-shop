import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentCreateWithoutWatchInputObjectSchema as WatchContentCreateWithoutWatchInputObjectSchema } from './WatchContentCreateWithoutWatchInput.schema';
import { WatchContentUncheckedCreateWithoutWatchInputObjectSchema as WatchContentUncheckedCreateWithoutWatchInputObjectSchema } from './WatchContentUncheckedCreateWithoutWatchInput.schema';
import { WatchContentCreateOrConnectWithoutWatchInputObjectSchema as WatchContentCreateOrConnectWithoutWatchInputObjectSchema } from './WatchContentCreateOrConnectWithoutWatchInput.schema';
import { WatchContentUpsertWithoutWatchInputObjectSchema as WatchContentUpsertWithoutWatchInputObjectSchema } from './WatchContentUpsertWithoutWatchInput.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './WatchContentWhereInput.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './WatchContentWhereUniqueInput.schema';
import { WatchContentUpdateToOneWithWhereWithoutWatchInputObjectSchema as WatchContentUpdateToOneWithWhereWithoutWatchInputObjectSchema } from './WatchContentUpdateToOneWithWhereWithoutWatchInput.schema';
import { WatchContentUpdateWithoutWatchInputObjectSchema as WatchContentUpdateWithoutWatchInputObjectSchema } from './WatchContentUpdateWithoutWatchInput.schema';
import { WatchContentUncheckedUpdateWithoutWatchInputObjectSchema as WatchContentUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchContentUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchContentCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchContentCreateOrConnectWithoutWatchInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchContentUpsertWithoutWatchInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchContentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchContentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchContentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchContentUpdateToOneWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedUpdateWithoutWatchInputObjectSchema)]).optional()
}).strict();
export const WatchContentUncheckedUpdateOneWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WatchContentUncheckedUpdateOneWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentUncheckedUpdateOneWithoutWatchNestedInput>;
export const WatchContentUncheckedUpdateOneWithoutWatchNestedInputObjectZodSchema = makeSchema();

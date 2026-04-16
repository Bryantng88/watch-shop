import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2CreateWithoutWatchInputObjectSchema as WatchSpecV2CreateWithoutWatchInputObjectSchema } from './WatchSpecV2CreateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedCreateWithoutWatchInput.schema';
import { WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema as WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema } from './WatchSpecV2CreateOrConnectWithoutWatchInput.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './WatchSpecV2WhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecV2CreateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema).optional(),
  connect: z.lazy(() => WatchSpecV2WhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UncheckedCreateNestedOneWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UncheckedCreateNestedOneWithoutWatchInput>;
export const WatchSpecV2UncheckedCreateNestedOneWithoutWatchInputObjectZodSchema = makeSchema();

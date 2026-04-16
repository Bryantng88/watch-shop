import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentCreateWithoutWatchInputObjectSchema as WatchContentCreateWithoutWatchInputObjectSchema } from './WatchContentCreateWithoutWatchInput.schema';
import { WatchContentUncheckedCreateWithoutWatchInputObjectSchema as WatchContentUncheckedCreateWithoutWatchInputObjectSchema } from './WatchContentUncheckedCreateWithoutWatchInput.schema';
import { WatchContentCreateOrConnectWithoutWatchInputObjectSchema as WatchContentCreateOrConnectWithoutWatchInputObjectSchema } from './WatchContentCreateOrConnectWithoutWatchInput.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './WatchContentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchContentCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchContentCreateOrConnectWithoutWatchInputObjectSchema).optional(),
  connect: z.lazy(() => WatchContentWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchContentCreateNestedOneWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchContentCreateNestedOneWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentCreateNestedOneWithoutWatchInput>;
export const WatchContentCreateNestedOneWithoutWatchInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchContentInputObjectSchema as WatchCreateWithoutWatchContentInputObjectSchema } from './WatchCreateWithoutWatchContentInput.schema';
import { WatchUncheckedCreateWithoutWatchContentInputObjectSchema as WatchUncheckedCreateWithoutWatchContentInputObjectSchema } from './WatchUncheckedCreateWithoutWatchContentInput.schema';
import { WatchCreateOrConnectWithoutWatchContentInputObjectSchema as WatchCreateOrConnectWithoutWatchContentInputObjectSchema } from './WatchCreateOrConnectWithoutWatchContentInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchContentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchContentInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutWatchContentInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchContentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchContentInput>;
export const WatchCreateNestedOneWithoutWatchContentInputObjectZodSchema = makeSchema();

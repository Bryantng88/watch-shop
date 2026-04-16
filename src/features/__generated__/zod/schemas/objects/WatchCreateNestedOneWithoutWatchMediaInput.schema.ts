import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchMediaInputObjectSchema as WatchCreateWithoutWatchMediaInputObjectSchema } from './WatchCreateWithoutWatchMediaInput.schema';
import { WatchUncheckedCreateWithoutWatchMediaInputObjectSchema as WatchUncheckedCreateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedCreateWithoutWatchMediaInput.schema';
import { WatchCreateOrConnectWithoutWatchMediaInputObjectSchema as WatchCreateOrConnectWithoutWatchMediaInputObjectSchema } from './WatchCreateOrConnectWithoutWatchMediaInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchMediaInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchMediaInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutWatchMediaInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchMediaInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchMediaInput>;
export const WatchCreateNestedOneWithoutWatchMediaInputObjectZodSchema = makeSchema();

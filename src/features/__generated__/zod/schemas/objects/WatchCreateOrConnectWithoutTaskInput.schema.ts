import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutTaskInputObjectSchema as WatchCreateWithoutTaskInputObjectSchema } from './WatchCreateWithoutTaskInput.schema';
import { WatchUncheckedCreateWithoutTaskInputObjectSchema as WatchUncheckedCreateWithoutTaskInputObjectSchema } from './WatchUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutTaskInput>;
export const WatchCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();

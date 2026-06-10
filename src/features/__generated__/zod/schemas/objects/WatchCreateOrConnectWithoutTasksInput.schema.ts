import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutTasksInputObjectSchema as WatchCreateWithoutTasksInputObjectSchema } from './WatchCreateWithoutTasksInput.schema';
import { WatchUncheckedCreateWithoutTasksInputObjectSchema as WatchUncheckedCreateWithoutTasksInputObjectSchema } from './WatchUncheckedCreateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTasksInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutTasksInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutTasksInput>;
export const WatchCreateOrConnectWithoutTasksInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutTasksInputObjectSchema as WatchCreateWithoutTasksInputObjectSchema } from './WatchCreateWithoutTasksInput.schema';
import { WatchUncheckedCreateWithoutTasksInputObjectSchema as WatchUncheckedCreateWithoutTasksInputObjectSchema } from './WatchUncheckedCreateWithoutTasksInput.schema';
import { WatchCreateOrConnectWithoutTasksInputObjectSchema as WatchCreateOrConnectWithoutTasksInputObjectSchema } from './WatchCreateOrConnectWithoutTasksInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutTasksInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutTasksInput>;
export const WatchCreateNestedOneWithoutTasksInputObjectZodSchema = makeSchema();

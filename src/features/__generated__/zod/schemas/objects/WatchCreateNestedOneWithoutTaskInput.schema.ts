import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutTaskInputObjectSchema as WatchCreateWithoutTaskInputObjectSchema } from './WatchCreateWithoutTaskInput.schema';
import { WatchUncheckedCreateWithoutTaskInputObjectSchema as WatchUncheckedCreateWithoutTaskInputObjectSchema } from './WatchUncheckedCreateWithoutTaskInput.schema';
import { WatchCreateOrConnectWithoutTaskInputObjectSchema as WatchCreateOrConnectWithoutTaskInputObjectSchema } from './WatchCreateOrConnectWithoutTaskInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutTaskInput>;
export const WatchCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();

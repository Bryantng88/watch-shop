import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutTasksInputObjectSchema as WatchCreateWithoutTasksInputObjectSchema } from './WatchCreateWithoutTasksInput.schema';
import { WatchUncheckedCreateWithoutTasksInputObjectSchema as WatchUncheckedCreateWithoutTasksInputObjectSchema } from './WatchUncheckedCreateWithoutTasksInput.schema';
import { WatchCreateOrConnectWithoutTasksInputObjectSchema as WatchCreateOrConnectWithoutTasksInputObjectSchema } from './WatchCreateOrConnectWithoutTasksInput.schema';
import { WatchUpsertWithoutTasksInputObjectSchema as WatchUpsertWithoutTasksInputObjectSchema } from './WatchUpsertWithoutTasksInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutTasksInputObjectSchema as WatchUpdateToOneWithWhereWithoutTasksInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutTasksInput.schema';
import { WatchUpdateWithoutTasksInputObjectSchema as WatchUpdateWithoutTasksInputObjectSchema } from './WatchUpdateWithoutTasksInput.schema';
import { WatchUncheckedUpdateWithoutTasksInputObjectSchema as WatchUncheckedUpdateWithoutTasksInputObjectSchema } from './WatchUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutTasksInputObjectSchema), z.lazy(() => WatchUpdateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutTasksInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneWithoutTasksNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneWithoutTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneWithoutTasksNestedInput>;
export const WatchUpdateOneWithoutTasksNestedInputObjectZodSchema = makeSchema();

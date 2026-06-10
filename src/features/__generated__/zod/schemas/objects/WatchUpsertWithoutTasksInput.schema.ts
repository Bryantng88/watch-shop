import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutTasksInputObjectSchema as WatchUpdateWithoutTasksInputObjectSchema } from './WatchUpdateWithoutTasksInput.schema';
import { WatchUncheckedUpdateWithoutTasksInputObjectSchema as WatchUncheckedUpdateWithoutTasksInputObjectSchema } from './WatchUncheckedUpdateWithoutTasksInput.schema';
import { WatchCreateWithoutTasksInputObjectSchema as WatchCreateWithoutTasksInputObjectSchema } from './WatchCreateWithoutTasksInput.schema';
import { WatchUncheckedCreateWithoutTasksInputObjectSchema as WatchUncheckedCreateWithoutTasksInputObjectSchema } from './WatchUncheckedCreateWithoutTasksInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTasksInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutTasksInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutTasksInput>;
export const WatchUpsertWithoutTasksInputObjectZodSchema = makeSchema();

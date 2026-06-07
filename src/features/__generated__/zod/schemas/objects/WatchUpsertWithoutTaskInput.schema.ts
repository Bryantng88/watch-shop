import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutTaskInputObjectSchema as WatchUpdateWithoutTaskInputObjectSchema } from './WatchUpdateWithoutTaskInput.schema';
import { WatchUncheckedUpdateWithoutTaskInputObjectSchema as WatchUncheckedUpdateWithoutTaskInputObjectSchema } from './WatchUncheckedUpdateWithoutTaskInput.schema';
import { WatchCreateWithoutTaskInputObjectSchema as WatchCreateWithoutTaskInputObjectSchema } from './WatchCreateWithoutTaskInput.schema';
import { WatchUncheckedCreateWithoutTaskInputObjectSchema as WatchUncheckedCreateWithoutTaskInputObjectSchema } from './WatchUncheckedCreateWithoutTaskInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutTaskInput>;
export const WatchUpsertWithoutTaskInputObjectZodSchema = makeSchema();

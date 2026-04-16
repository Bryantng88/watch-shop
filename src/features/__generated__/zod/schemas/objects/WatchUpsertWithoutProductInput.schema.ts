import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutProductInputObjectSchema as WatchUpdateWithoutProductInputObjectSchema } from './WatchUpdateWithoutProductInput.schema';
import { WatchUncheckedUpdateWithoutProductInputObjectSchema as WatchUncheckedUpdateWithoutProductInputObjectSchema } from './WatchUncheckedUpdateWithoutProductInput.schema';
import { WatchCreateWithoutProductInputObjectSchema as WatchCreateWithoutProductInputObjectSchema } from './WatchCreateWithoutProductInput.schema';
import { WatchUncheckedCreateWithoutProductInputObjectSchema as WatchUncheckedCreateWithoutProductInputObjectSchema } from './WatchUncheckedCreateWithoutProductInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutProductInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutProductInput>;
export const WatchUpsertWithoutProductInputObjectZodSchema = makeSchema();

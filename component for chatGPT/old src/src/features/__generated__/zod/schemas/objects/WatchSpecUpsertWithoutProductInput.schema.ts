import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecUpdateWithoutProductInputObjectSchema as WatchSpecUpdateWithoutProductInputObjectSchema } from './WatchSpecUpdateWithoutProductInput.schema';
import { WatchSpecUncheckedUpdateWithoutProductInputObjectSchema as WatchSpecUncheckedUpdateWithoutProductInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutProductInput.schema';
import { WatchSpecCreateWithoutProductInputObjectSchema as WatchSpecCreateWithoutProductInputObjectSchema } from './WatchSpecCreateWithoutProductInput.schema';
import { WatchSpecUncheckedCreateWithoutProductInputObjectSchema as WatchSpecUncheckedCreateWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateWithoutProductInput.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './WatchSpecWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchSpecUpdateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchSpecCreateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutProductInputObjectSchema)]),
  where: z.lazy(() => WatchSpecWhereInputObjectSchema).optional()
}).strict();
export const WatchSpecUpsertWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchSpecUpsertWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpsertWithoutProductInput>;
export const WatchSpecUpsertWithoutProductInputObjectZodSchema = makeSchema();

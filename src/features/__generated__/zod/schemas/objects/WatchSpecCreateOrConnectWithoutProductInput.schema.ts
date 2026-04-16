import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecCreateWithoutProductInputObjectSchema as WatchSpecCreateWithoutProductInputObjectSchema } from './WatchSpecCreateWithoutProductInput.schema';
import { WatchSpecUncheckedCreateWithoutProductInputObjectSchema as WatchSpecUncheckedCreateWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchSpecCreateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const WatchSpecCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateOrConnectWithoutProductInput>;
export const WatchSpecCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

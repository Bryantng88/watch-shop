import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecCreateWithoutMarketSegmentInputObjectSchema as WatchSpecCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateWithoutMarketSegmentInput.schema';
import { WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedCreateWithoutMarketSegmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchSpecCreateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema)])
}).strict();
export const WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateOrConnectWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateOrConnectWithoutMarketSegmentInput>;
export const WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateWithoutMarketSegmentInputObjectSchema as WatchSpecUpdateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUpdateWithoutMarketSegmentInput.schema';
import { WatchSpecUncheckedUpdateWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedUpdateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutMarketSegmentInput.schema';
import { WatchSpecCreateWithoutMarketSegmentInputObjectSchema as WatchSpecCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateWithoutMarketSegmentInput.schema';
import { WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedCreateWithoutMarketSegmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchSpecUpdateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutMarketSegmentInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchSpecCreateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema)])
}).strict();
export const WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInput>;
export const WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInputObjectZodSchema = makeSchema();

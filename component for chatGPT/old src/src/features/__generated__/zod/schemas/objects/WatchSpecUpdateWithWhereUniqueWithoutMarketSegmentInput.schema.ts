import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateWithoutMarketSegmentInputObjectSchema as WatchSpecUpdateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUpdateWithoutMarketSegmentInput.schema';
import { WatchSpecUncheckedUpdateWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedUpdateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutMarketSegmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchSpecUpdateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutMarketSegmentInputObjectSchema)])
}).strict();
export const WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInput>;
export const WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInputObjectZodSchema = makeSchema();

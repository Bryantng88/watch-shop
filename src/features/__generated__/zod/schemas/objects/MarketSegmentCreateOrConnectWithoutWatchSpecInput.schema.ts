import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentCreateWithoutWatchSpecInputObjectSchema as MarketSegmentCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateOrConnectWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateOrConnectWithoutWatchSpecInput>;
export const MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateOrConnectWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateOrConnectWithoutWatchSpecsInput>;
export const MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentCreateWithoutWatchSpecInputObjectSchema as MarketSegmentCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecInput.schema';
import { MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema as MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema } from './MarketSegmentCreateOrConnectWithoutWatchSpecInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentCreateWithoutWatchSpecInputObjectSchema).array(), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecInput>;
export const MarketSegmentUncheckedCreateNestedManyWithoutWatchSpecInputObjectZodSchema = makeSchema();

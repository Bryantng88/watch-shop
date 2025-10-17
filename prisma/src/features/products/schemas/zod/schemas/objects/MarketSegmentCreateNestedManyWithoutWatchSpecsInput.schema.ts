import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecsInput.schema';
import { MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateOrConnectWithoutWatchSpecsInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentCreateWithoutWatchSpecsInputObjectSchema).array(), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MarketSegmentCreateNestedManyWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateNestedManyWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateNestedManyWithoutWatchSpecsInput>;
export const MarketSegmentCreateNestedManyWithoutWatchSpecsInputObjectZodSchema = makeSchema();

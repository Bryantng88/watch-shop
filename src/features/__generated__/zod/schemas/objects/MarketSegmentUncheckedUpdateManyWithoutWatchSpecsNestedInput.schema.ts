import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecsInput.schema';
import { MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateOrConnectWithoutWatchSpecsInput.schema';
import { MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema as MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema as MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInput.schema';
import { MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema as MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInput.schema';
import { MarketSegmentScalarWhereInputObjectSchema as MarketSegmentScalarWhereInputObjectSchema } from './MarketSegmentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentCreateWithoutWatchSpecsInputObjectSchema).array(), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MarketSegmentScalarWhereInputObjectSchema), z.lazy(() => MarketSegmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MarketSegmentUncheckedUpdateManyWithoutWatchSpecsNestedInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedUpdateManyWithoutWatchSpecsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedUpdateManyWithoutWatchSpecsNestedInput>;
export const MarketSegmentUncheckedUpdateManyWithoutWatchSpecsNestedInputObjectZodSchema = makeSchema();

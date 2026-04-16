import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentCreateWithoutWatchSpecInputObjectSchema as MarketSegmentCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecInput.schema';
import { MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema as MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema } from './MarketSegmentCreateOrConnectWithoutWatchSpecInput.schema';
import { MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema as MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema } from './MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema as MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema } from './MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInput.schema';
import { MarketSegmentUpdateManyWithWhereWithoutWatchSpecInputObjectSchema as MarketSegmentUpdateManyWithWhereWithoutWatchSpecInputObjectSchema } from './MarketSegmentUpdateManyWithWhereWithoutWatchSpecInput.schema';
import { MarketSegmentScalarWhereInputObjectSchema as MarketSegmentScalarWhereInputObjectSchema } from './MarketSegmentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentCreateWithoutWatchSpecInputObjectSchema).array(), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentCreateOrConnectWithoutWatchSpecInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema), z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MarketSegmentUpdateManyWithWhereWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUpdateManyWithWhereWithoutWatchSpecInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MarketSegmentScalarWhereInputObjectSchema), z.lazy(() => MarketSegmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MarketSegmentUpdateManyWithoutWatchSpecNestedInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateManyWithoutWatchSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateManyWithoutWatchSpecNestedInput>;
export const MarketSegmentUpdateManyWithoutWatchSpecNestedInputObjectZodSchema = makeSchema();

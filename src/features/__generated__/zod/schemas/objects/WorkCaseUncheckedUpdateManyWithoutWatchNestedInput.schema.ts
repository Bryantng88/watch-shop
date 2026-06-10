import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutWatchInputObjectSchema as WorkCaseCreateWithoutWatchInputObjectSchema } from './WorkCaseCreateWithoutWatchInput.schema';
import { WorkCaseUncheckedCreateWithoutWatchInputObjectSchema as WorkCaseUncheckedCreateWithoutWatchInputObjectSchema } from './WorkCaseUncheckedCreateWithoutWatchInput.schema';
import { WorkCaseCreateOrConnectWithoutWatchInputObjectSchema as WorkCaseCreateOrConnectWithoutWatchInputObjectSchema } from './WorkCaseCreateOrConnectWithoutWatchInput.schema';
import { WorkCaseUpsertWithWhereUniqueWithoutWatchInputObjectSchema as WorkCaseUpsertWithWhereUniqueWithoutWatchInputObjectSchema } from './WorkCaseUpsertWithWhereUniqueWithoutWatchInput.schema';
import { WorkCaseCreateManyWatchInputEnvelopeObjectSchema as WorkCaseCreateManyWatchInputEnvelopeObjectSchema } from './WorkCaseCreateManyWatchInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithWhereUniqueWithoutWatchInputObjectSchema as WorkCaseUpdateWithWhereUniqueWithoutWatchInputObjectSchema } from './WorkCaseUpdateWithWhereUniqueWithoutWatchInput.schema';
import { WorkCaseUpdateManyWithWhereWithoutWatchInputObjectSchema as WorkCaseUpdateManyWithWhereWithoutWatchInputObjectSchema } from './WorkCaseUpdateManyWithWhereWithoutWatchInput.schema';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyWatchInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseUpdateManyWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUpdateManyWithWhereWithoutWatchInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUncheckedUpdateManyWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedUpdateManyWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedUpdateManyWithoutWatchNestedInput>;
export const WorkCaseUncheckedUpdateManyWithoutWatchNestedInputObjectZodSchema = makeSchema();

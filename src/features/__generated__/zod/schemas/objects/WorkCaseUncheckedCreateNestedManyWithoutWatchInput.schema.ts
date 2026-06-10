import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutWatchInputObjectSchema as WorkCaseCreateWithoutWatchInputObjectSchema } from './WorkCaseCreateWithoutWatchInput.schema';
import { WorkCaseUncheckedCreateWithoutWatchInputObjectSchema as WorkCaseUncheckedCreateWithoutWatchInputObjectSchema } from './WorkCaseUncheckedCreateWithoutWatchInput.schema';
import { WorkCaseCreateOrConnectWithoutWatchInputObjectSchema as WorkCaseCreateOrConnectWithoutWatchInputObjectSchema } from './WorkCaseCreateOrConnectWithoutWatchInput.schema';
import { WorkCaseCreateManyWatchInputEnvelopeObjectSchema as WorkCaseCreateManyWatchInputEnvelopeObjectSchema } from './WorkCaseCreateManyWatchInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyWatchInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUncheckedCreateNestedManyWithoutWatchInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedCreateNestedManyWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedCreateNestedManyWithoutWatchInput>;
export const WorkCaseUncheckedCreateNestedManyWithoutWatchInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutRaisedByUserInputObjectSchema as WorkCaseCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutRaisedByUserInput.schema';
import { WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema as WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateOrConnectWithoutRaisedByUserInput.schema';
import { WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInputObjectSchema as WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInputObjectSchema } from './WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInput.schema';
import { WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema as WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema } from './WorkCaseCreateManyRaisedByUserInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInputObjectSchema as WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInputObjectSchema } from './WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInput.schema';
import { WorkCaseUpdateManyWithWhereWithoutRaisedByUserInputObjectSchema as WorkCaseUpdateManyWithWhereWithoutRaisedByUserInputObjectSchema } from './WorkCaseUpdateManyWithWhereWithoutRaisedByUserInput.schema';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutRaisedByUserInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseUpdateManyWithWhereWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUpdateManyWithWhereWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUpdateManyWithoutRaisedByUserNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithoutRaisedByUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithoutRaisedByUserNestedInput>;
export const WorkCaseUpdateManyWithoutRaisedByUserNestedInputObjectZodSchema = makeSchema();

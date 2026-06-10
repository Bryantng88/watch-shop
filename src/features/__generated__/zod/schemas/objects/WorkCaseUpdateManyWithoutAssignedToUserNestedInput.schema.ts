import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutAssignedToUserInputObjectSchema as WorkCaseCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateWithoutAssignedToUserInput.schema';
import { WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutAssignedToUserInput.schema';
import { WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema as WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateOrConnectWithoutAssignedToUserInput.schema';
import { WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema as WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInput.schema';
import { WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema as WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema } from './WorkCaseCreateManyAssignedToUserInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema as WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInput.schema';
import { WorkCaseUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema as WorkCaseUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema } from './WorkCaseUpdateManyWithWhereWithoutAssignedToUserInput.schema';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUpdateManyWithoutAssignedToUserNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithoutAssignedToUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithoutAssignedToUserNestedInput>;
export const WorkCaseUpdateManyWithoutAssignedToUserNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutAssignedToUserInputObjectSchema as WorkCaseCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateWithoutAssignedToUserInput.schema';
import { WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema as WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutAssignedToUserInput.schema';
import { WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema as WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './WorkCaseCreateOrConnectWithoutAssignedToUserInput.schema';
import { WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema as WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema } from './WorkCaseCreateManyAssignedToUserInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutAssignedToUserInput>;
export const WorkCaseCreateNestedManyWithoutAssignedToUserInputObjectZodSchema = makeSchema();

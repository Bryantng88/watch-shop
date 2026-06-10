import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutRaisedByUserInputObjectSchema as WorkCaseCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateWithoutRaisedByUserInput.schema';
import { WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema as WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema } from './WorkCaseUncheckedCreateWithoutRaisedByUserInput.schema';
import { WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema as WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema } from './WorkCaseCreateOrConnectWithoutRaisedByUserInput.schema';
import { WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema as WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema } from './WorkCaseCreateManyRaisedByUserInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutRaisedByUserInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutRaisedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutRaisedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutRaisedByUserInput>;
export const WorkCaseCreateNestedManyWithoutRaisedByUserInputObjectZodSchema = makeSchema();

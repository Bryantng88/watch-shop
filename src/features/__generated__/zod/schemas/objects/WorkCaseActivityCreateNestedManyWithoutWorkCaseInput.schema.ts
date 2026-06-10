import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutWorkCaseInput.schema';
import { WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateOrConnectWithoutWorkCaseInput.schema';
import { WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema as WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema } from './WorkCaseActivityCreateManyWorkCaseInputEnvelope.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema).array(), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseActivityCreateNestedManyWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateNestedManyWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateNestedManyWithoutWorkCaseInput>;
export const WorkCaseActivityCreateNestedManyWithoutWorkCaseInputObjectZodSchema = makeSchema();

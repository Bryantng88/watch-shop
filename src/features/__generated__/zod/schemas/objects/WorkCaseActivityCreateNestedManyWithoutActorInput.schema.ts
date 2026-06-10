import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityCreateWithoutActorInputObjectSchema as WorkCaseActivityCreateWithoutActorInputObjectSchema } from './WorkCaseActivityCreateWithoutActorInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutActorInput.schema';
import { WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema as WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema } from './WorkCaseActivityCreateOrConnectWithoutActorInput.schema';
import { WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema as WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema } from './WorkCaseActivityCreateManyActorInputEnvelope.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityCreateWithoutActorInputObjectSchema).array(), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseActivityCreateNestedManyWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateNestedManyWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateNestedManyWithoutActorInput>;
export const WorkCaseActivityCreateNestedManyWithoutActorInputObjectZodSchema = makeSchema();

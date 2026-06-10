import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityCreateWithoutActorInputObjectSchema as WorkCaseActivityCreateWithoutActorInputObjectSchema } from './WorkCaseActivityCreateWithoutActorInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutActorInput.schema';
import { WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema as WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema } from './WorkCaseActivityCreateOrConnectWithoutActorInput.schema';
import { WorkCaseActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema as WorkCaseActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema } from './WorkCaseActivityUpsertWithWhereUniqueWithoutActorInput.schema';
import { WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema as WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema } from './WorkCaseActivityCreateManyActorInputEnvelope.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema as WorkCaseActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema } from './WorkCaseActivityUpdateWithWhereUniqueWithoutActorInput.schema';
import { WorkCaseActivityUpdateManyWithWhereWithoutActorInputObjectSchema as WorkCaseActivityUpdateManyWithWhereWithoutActorInputObjectSchema } from './WorkCaseActivityUpdateManyWithWhereWithoutActorInput.schema';
import { WorkCaseActivityScalarWhereInputObjectSchema as WorkCaseActivityScalarWhereInputObjectSchema } from './WorkCaseActivityScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityCreateWithoutActorInputObjectSchema).array(), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutActorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityCreateOrConnectWithoutActorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseActivityCreateManyActorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseActivityUpdateManyWithWhereWithoutActorInputObjectSchema), z.lazy(() => WorkCaseActivityUpdateManyWithWhereWithoutActorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema), z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInput>;
export const WorkCaseActivityUncheckedUpdateManyWithoutActorNestedInputObjectZodSchema = makeSchema();

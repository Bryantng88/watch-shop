import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateWithoutWorkCaseInput.schema';
import { WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema as WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUncheckedCreateWithoutWorkCaseInput.schema';
import { WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema as WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityCreateOrConnectWithoutWorkCaseInput.schema';
import { WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema as WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInput.schema';
import { WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema as WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema } from './WorkCaseActivityCreateManyWorkCaseInputEnvelope.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema as WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInput.schema';
import { WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInputObjectSchema as WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInputObjectSchema } from './WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInput.schema';
import { WorkCaseActivityScalarWhereInputObjectSchema as WorkCaseActivityScalarWhereInputObjectSchema } from './WorkCaseActivityScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema).array(), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUncheckedCreateWithoutWorkCaseInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityCreateOrConnectWithoutWorkCaseInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseActivityWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityUpdateManyWithWhereWithoutWorkCaseInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema), z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInput>;
export const WorkCaseActivityUncheckedUpdateManyWithoutWorkCaseNestedInputObjectZodSchema = makeSchema();

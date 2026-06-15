import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutOrderInputObjectSchema as WorkCaseCreateWithoutOrderInputObjectSchema } from './WorkCaseCreateWithoutOrderInput.schema';
import { WorkCaseUncheckedCreateWithoutOrderInputObjectSchema as WorkCaseUncheckedCreateWithoutOrderInputObjectSchema } from './WorkCaseUncheckedCreateWithoutOrderInput.schema';
import { WorkCaseCreateOrConnectWithoutOrderInputObjectSchema as WorkCaseCreateOrConnectWithoutOrderInputObjectSchema } from './WorkCaseCreateOrConnectWithoutOrderInput.schema';
import { WorkCaseUpsertWithWhereUniqueWithoutOrderInputObjectSchema as WorkCaseUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './WorkCaseUpsertWithWhereUniqueWithoutOrderInput.schema';
import { WorkCaseCreateManyOrderInputEnvelopeObjectSchema as WorkCaseCreateManyOrderInputEnvelopeObjectSchema } from './WorkCaseCreateManyOrderInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithWhereUniqueWithoutOrderInputObjectSchema as WorkCaseUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './WorkCaseUpdateWithWhereUniqueWithoutOrderInput.schema';
import { WorkCaseUpdateManyWithWhereWithoutOrderInputObjectSchema as WorkCaseUpdateManyWithWhereWithoutOrderInputObjectSchema } from './WorkCaseUpdateManyWithWhereWithoutOrderInput.schema';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUncheckedUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedUpdateManyWithoutOrderNestedInput>;
export const WorkCaseUncheckedUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutCategoryInputObjectSchema as WorkCaseCreateWithoutCategoryInputObjectSchema } from './WorkCaseCreateWithoutCategoryInput.schema';
import { WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema as WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedCreateWithoutCategoryInput.schema';
import { WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema as WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema } from './WorkCaseCreateOrConnectWithoutCategoryInput.schema';
import { WorkCaseUpsertWithWhereUniqueWithoutCategoryInputObjectSchema as WorkCaseUpsertWithWhereUniqueWithoutCategoryInputObjectSchema } from './WorkCaseUpsertWithWhereUniqueWithoutCategoryInput.schema';
import { WorkCaseCreateManyCategoryInputEnvelopeObjectSchema as WorkCaseCreateManyCategoryInputEnvelopeObjectSchema } from './WorkCaseCreateManyCategoryInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithWhereUniqueWithoutCategoryInputObjectSchema as WorkCaseUpdateWithWhereUniqueWithoutCategoryInputObjectSchema } from './WorkCaseUpdateWithWhereUniqueWithoutCategoryInput.schema';
import { WorkCaseUpdateManyWithWhereWithoutCategoryInputObjectSchema as WorkCaseUpdateManyWithWhereWithoutCategoryInputObjectSchema } from './WorkCaseUpdateManyWithWhereWithoutCategoryInput.schema';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutCategoryInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyCategoryInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutCategoryInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseUpdateManyWithWhereWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUpdateManyWithWhereWithoutCategoryInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUpdateManyWithoutCategoryNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithoutCategoryNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithoutCategoryNestedInput>;
export const WorkCaseUpdateManyWithoutCategoryNestedInputObjectZodSchema = makeSchema();

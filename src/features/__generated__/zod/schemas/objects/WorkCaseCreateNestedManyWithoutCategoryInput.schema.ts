import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutCategoryInputObjectSchema as WorkCaseCreateWithoutCategoryInputObjectSchema } from './WorkCaseCreateWithoutCategoryInput.schema';
import { WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema as WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedCreateWithoutCategoryInput.schema';
import { WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema as WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema } from './WorkCaseCreateOrConnectWithoutCategoryInput.schema';
import { WorkCaseCreateManyCategoryInputEnvelopeObjectSchema as WorkCaseCreateManyCategoryInputEnvelopeObjectSchema } from './WorkCaseCreateManyCategoryInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutCategoryInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyCategoryInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseCreateNestedManyWithoutCategoryInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutCategoryInput>;
export const WorkCaseCreateNestedManyWithoutCategoryInputObjectZodSchema = makeSchema();

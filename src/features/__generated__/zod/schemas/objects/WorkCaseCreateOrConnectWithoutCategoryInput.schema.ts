import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutCategoryInputObjectSchema as WorkCaseCreateWithoutCategoryInputObjectSchema } from './WorkCaseCreateWithoutCategoryInput.schema';
import { WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema as WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutCategoryInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutCategoryInput>;
export const WorkCaseCreateOrConnectWithoutCategoryInputObjectZodSchema = makeSchema();

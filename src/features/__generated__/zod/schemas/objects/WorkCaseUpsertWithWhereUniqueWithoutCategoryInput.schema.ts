import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutCategoryInputObjectSchema as WorkCaseUpdateWithoutCategoryInputObjectSchema } from './WorkCaseUpdateWithoutCategoryInput.schema';
import { WorkCaseUncheckedUpdateWithoutCategoryInputObjectSchema as WorkCaseUncheckedUpdateWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutCategoryInput.schema';
import { WorkCaseCreateWithoutCategoryInputObjectSchema as WorkCaseCreateWithoutCategoryInputObjectSchema } from './WorkCaseCreateWithoutCategoryInput.schema';
import { WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema as WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutCategoryInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const WorkCaseUpsertWithWhereUniqueWithoutCategoryInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutCategoryInput>;
export const WorkCaseUpsertWithWhereUniqueWithoutCategoryInputObjectZodSchema = makeSchema();

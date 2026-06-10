import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutCategoryInputObjectSchema as WorkCaseUpdateWithoutCategoryInputObjectSchema } from './WorkCaseUpdateWithoutCategoryInput.schema';
import { WorkCaseUncheckedUpdateWithoutCategoryInputObjectSchema as WorkCaseUncheckedUpdateWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutCategoryInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutCategoryInputObjectSchema)])
}).strict();
export const WorkCaseUpdateWithWhereUniqueWithoutCategoryInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutCategoryInput>;
export const WorkCaseUpdateWithWhereUniqueWithoutCategoryInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutCategoryInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutCategoryInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateManyWithoutCategoryInputObjectSchema)])
}).strict();
export const WorkCaseUpdateManyWithWhereWithoutCategoryInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutCategoryInput>;
export const WorkCaseUpdateManyWithWhereWithoutCategoryInputObjectZodSchema = makeSchema();

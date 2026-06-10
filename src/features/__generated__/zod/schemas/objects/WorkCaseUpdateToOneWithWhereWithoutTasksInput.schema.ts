import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { WorkCaseUpdateWithoutTasksInputObjectSchema as WorkCaseUpdateWithoutTasksInputObjectSchema } from './WorkCaseUpdateWithoutTasksInput.schema';
import { WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema as WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema)])
}).strict();
export const WorkCaseUpdateToOneWithWhereWithoutTasksInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateToOneWithWhereWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateToOneWithWhereWithoutTasksInput>;
export const WorkCaseUpdateToOneWithWhereWithoutTasksInputObjectZodSchema = makeSchema();

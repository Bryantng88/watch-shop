import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseUpdateWithoutTasksInputObjectSchema as WorkCaseUpdateWithoutTasksInputObjectSchema } from './WorkCaseUpdateWithoutTasksInput.schema';
import { WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema as WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutTasksInput.schema';
import { WorkCaseCreateWithoutTasksInputObjectSchema as WorkCaseCreateWithoutTasksInputObjectSchema } from './WorkCaseCreateWithoutTasksInput.schema';
import { WorkCaseUncheckedCreateWithoutTasksInputObjectSchema as WorkCaseUncheckedCreateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedCreateWithoutTasksInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutTasksInputObjectSchema)]),
  where: z.lazy(() => WorkCaseWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseUpsertWithoutTasksInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithoutTasksInput>;
export const WorkCaseUpsertWithoutTasksInputObjectZodSchema = makeSchema();

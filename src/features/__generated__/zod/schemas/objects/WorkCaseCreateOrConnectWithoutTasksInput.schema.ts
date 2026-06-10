import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutTasksInputObjectSchema as WorkCaseCreateWithoutTasksInputObjectSchema } from './WorkCaseCreateWithoutTasksInput.schema';
import { WorkCaseUncheckedCreateWithoutTasksInputObjectSchema as WorkCaseUncheckedCreateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedCreateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutTasksInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutTasksInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutTasksInput>;
export const WorkCaseCreateOrConnectWithoutTasksInputObjectZodSchema = makeSchema();

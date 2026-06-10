import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutTasksInputObjectSchema as WorkCaseCreateWithoutTasksInputObjectSchema } from './WorkCaseCreateWithoutTasksInput.schema';
import { WorkCaseUncheckedCreateWithoutTasksInputObjectSchema as WorkCaseUncheckedCreateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedCreateWithoutTasksInput.schema';
import { WorkCaseCreateOrConnectWithoutTasksInputObjectSchema as WorkCaseCreateOrConnectWithoutTasksInputObjectSchema } from './WorkCaseCreateOrConnectWithoutTasksInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  connect: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkCaseCreateNestedOneWithoutTasksInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedOneWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedOneWithoutTasksInput>;
export const WorkCaseCreateNestedOneWithoutTasksInputObjectZodSchema = makeSchema();

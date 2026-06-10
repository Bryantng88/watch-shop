import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutTasksInputObjectSchema as WorkCaseCreateWithoutTasksInputObjectSchema } from './WorkCaseCreateWithoutTasksInput.schema';
import { WorkCaseUncheckedCreateWithoutTasksInputObjectSchema as WorkCaseUncheckedCreateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedCreateWithoutTasksInput.schema';
import { WorkCaseCreateOrConnectWithoutTasksInputObjectSchema as WorkCaseCreateOrConnectWithoutTasksInputObjectSchema } from './WorkCaseCreateOrConnectWithoutTasksInput.schema';
import { WorkCaseUpsertWithoutTasksInputObjectSchema as WorkCaseUpsertWithoutTasksInputObjectSchema } from './WorkCaseUpsertWithoutTasksInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateToOneWithWhereWithoutTasksInputObjectSchema as WorkCaseUpdateToOneWithWhereWithoutTasksInputObjectSchema } from './WorkCaseUpdateToOneWithWhereWithoutTasksInput.schema';
import { WorkCaseUpdateWithoutTasksInputObjectSchema as WorkCaseUpdateWithoutTasksInputObjectSchema } from './WorkCaseUpdateWithoutTasksInput.schema';
import { WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema as WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkCaseUpsertWithoutTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WorkCaseWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WorkCaseWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateToOneWithWhereWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUpdateWithoutTasksInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutTasksInputObjectSchema)]).optional()
}).strict();
export const WorkCaseUpdateOneWithoutTasksNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateOneWithoutTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateOneWithoutTasksNestedInput>;
export const WorkCaseUpdateOneWithoutTasksNestedInputObjectZodSchema = makeSchema();

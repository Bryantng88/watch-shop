import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCreateWithoutEventsInputObjectSchema as WorkflowExecutionCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutEventsInput.schema';
import { WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema as WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateOrConnectWithoutEventsInput.schema';
import { WorkflowExecutionUpsertWithoutEventsInputObjectSchema as WorkflowExecutionUpsertWithoutEventsInputObjectSchema } from './WorkflowExecutionUpsertWithoutEventsInput.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionUpdateToOneWithWhereWithoutEventsInputObjectSchema as WorkflowExecutionUpdateToOneWithWhereWithoutEventsInputObjectSchema } from './WorkflowExecutionUpdateToOneWithWhereWithoutEventsInput.schema';
import { WorkflowExecutionUpdateWithoutEventsInputObjectSchema as WorkflowExecutionUpdateWithoutEventsInputObjectSchema } from './WorkflowExecutionUpdateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedUpdateWithoutEventsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkflowExecutionUpsertWithoutEventsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkflowExecutionUpdateToOneWithWhereWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUpdateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInput>;
export const WorkflowExecutionUpdateOneRequiredWithoutEventsNestedInputObjectZodSchema = makeSchema();

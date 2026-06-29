import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateOrConnectWithoutWorkflowEventsInput.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './BusinessEventLogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema).optional(),
  connect: z.lazy(() => BusinessEventLogWhereUniqueInputObjectSchema).optional()
}).strict();
export const BusinessEventLogCreateNestedOneWithoutWorkflowEventsInputObjectSchema: z.ZodType<Prisma.BusinessEventLogCreateNestedOneWithoutWorkflowEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogCreateNestedOneWithoutWorkflowEventsInput>;
export const BusinessEventLogCreateNestedOneWithoutWorkflowEventsInputObjectZodSchema = makeSchema();

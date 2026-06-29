import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './BusinessEventLogWhereUniqueInput.schema';
import { BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutWorkflowEventsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BusinessEventLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema)])
}).strict();
export const BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema: z.ZodType<Prisma.BusinessEventLogCreateOrConnectWithoutWorkflowEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogCreateOrConnectWithoutWorkflowEventsInput>;
export const BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectZodSchema = makeSchema();

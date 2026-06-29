import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUpdateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema)]),
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema)]),
  where: z.lazy(() => BusinessEventLogWhereInputObjectSchema).optional()
}).strict();
export const BusinessEventLogUpsertWithoutWorkflowEventsInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUpsertWithoutWorkflowEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUpsertWithoutWorkflowEventsInput>;
export const BusinessEventLogUpsertWithoutWorkflowEventsInputObjectZodSchema = makeSchema();

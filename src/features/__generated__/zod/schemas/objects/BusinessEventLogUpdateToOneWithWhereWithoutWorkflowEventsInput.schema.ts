import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema';
import { BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUpdateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BusinessEventLogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema)])
}).strict();
export const BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInput>;
export const BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInputObjectZodSchema = makeSchema();

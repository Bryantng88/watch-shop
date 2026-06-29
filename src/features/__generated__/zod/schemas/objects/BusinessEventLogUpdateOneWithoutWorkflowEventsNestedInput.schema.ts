import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedCreateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema as BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogCreateOrConnectWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUpsertWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUpsertWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUpsertWithoutWorkflowEventsInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './BusinessEventLogWhereInput.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './BusinessEventLogWhereUniqueInput.schema';
import { BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUpdateWithoutWorkflowEventsInput.schema';
import { BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema as BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema } from './BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BusinessEventLogCreateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedCreateWithoutWorkflowEventsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BusinessEventLogCreateOrConnectWithoutWorkflowEventsInputObjectSchema).optional(),
  upsert: z.lazy(() => BusinessEventLogUpsertWithoutWorkflowEventsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => BusinessEventLogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => BusinessEventLogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => BusinessEventLogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BusinessEventLogUpdateToOneWithWhereWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUpdateWithoutWorkflowEventsInputObjectSchema), z.lazy(() => BusinessEventLogUncheckedUpdateWithoutWorkflowEventsInputObjectSchema)]).optional()
}).strict();
export const BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInput>;
export const BusinessEventLogUpdateOneWithoutWorkflowEventsNestedInputObjectZodSchema = makeSchema();

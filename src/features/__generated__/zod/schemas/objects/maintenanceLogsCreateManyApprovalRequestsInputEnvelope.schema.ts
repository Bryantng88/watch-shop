import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsCreateManyApprovalRequestsInputObjectSchema as maintenanceLogsCreateManyApprovalRequestsInputObjectSchema } from './maintenanceLogsCreateManyApprovalRequestsInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => maintenanceLogsCreateManyApprovalRequestsInputObjectSchema), z.lazy(() => maintenanceLogsCreateManyApprovalRequestsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectSchema: z.ZodType<Prisma.maintenanceLogsCreateManyApprovalRequestsInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsCreateManyApprovalRequestsInputEnvelope>;
export const maintenanceLogsCreateManyApprovalRequestsInputEnvelopeObjectZodSchema = makeSchema();

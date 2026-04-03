import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema as approvalRequestsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema } from './approvalRequestsCreateNestedOneWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string(),
  sourceType: z.string(),
  category: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
  execution: z.string().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  partId: z.string().optional().nullable(),
  cost: z.number().int().optional(),
  note: z.string().optional().nullable(),
  status: z.string().optional(),
  autoApproved: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  approvalRequests: z.lazy(() => approvalRequestsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema).optional(),
  technicalAssessments: z.lazy(() => technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema).optional()
}).strict();
export const maintenanceLogsCreateInputObjectSchema: z.ZodType<Prisma.maintenanceLogsCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsCreateInput>;
export const maintenanceLogsCreateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { TechnicalIssueOrderByWithRelationInputObjectSchema as TechnicalIssueOrderByWithRelationInputObjectSchema } from './TechnicalIssueOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  paidAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reference: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  direction: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  order_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  service_request_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendor_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisition_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  shipment_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updatedAt: SortOrderSchema.optional(),
  technical_issue_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  task: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PaymentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentOrderByWithRelationInput>;
export const PaymentOrderByWithRelationInputObjectZodSchema = makeSchema();

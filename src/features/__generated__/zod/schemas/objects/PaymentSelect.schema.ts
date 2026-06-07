import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { TechnicalIssueArgsObjectSchema as TechnicalIssueArgsObjectSchema } from './TechnicalIssueArgs.schema';
import { PaymentCountOutputTypeArgsObjectSchema as PaymentCountOutputTypeArgsObjectSchema } from './PaymentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  method: z.boolean().optional(),
  amount: z.boolean().optional(),
  currency: z.boolean().optional(),
  paidAt: z.boolean().optional(),
  reference: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  direction: z.boolean().optional(),
  order_id: z.boolean().optional(),
  service_request_id: z.boolean().optional(),
  vendor_id: z.boolean().optional(),
  acquisition_id: z.boolean().optional(),
  status: z.boolean().optional(),
  purpose: z.boolean().optional(),
  shipment_id: z.boolean().optional(),
  type: z.boolean().optional(),
  refNo: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  maintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  technical_issue_id: z.boolean().optional(),
  technicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PaymentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PaymentSelectObjectSchema: z.ZodType<Prisma.PaymentSelect> = makeSchema() as unknown as z.ZodType<Prisma.PaymentSelect>;
export const PaymentSelectObjectZodSchema = makeSchema();

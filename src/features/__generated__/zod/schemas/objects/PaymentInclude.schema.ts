import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { TechnicalIssueArgsObjectSchema as TechnicalIssueArgsObjectSchema } from './TechnicalIssueArgs.schema';
import { PaymentCountOutputTypeArgsObjectSchema as PaymentCountOutputTypeArgsObjectSchema } from './PaymentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  maintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  technicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PaymentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PaymentIncludeObjectSchema: z.ZodType<Prisma.PaymentInclude> = makeSchema() as unknown as z.ZodType<Prisma.PaymentInclude>;
export const PaymentIncludeObjectZodSchema = makeSchema();

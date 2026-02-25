import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { PaymentCountOutputTypeArgsObjectSchema as PaymentCountOutputTypeArgsObjectSchema } from './PaymentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PaymentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PaymentIncludeObjectSchema: z.ZodType<Prisma.PaymentInclude> = makeSchema() as unknown as z.ZodType<Prisma.PaymentInclude>;
export const PaymentIncludeObjectZodSchema = makeSchema();

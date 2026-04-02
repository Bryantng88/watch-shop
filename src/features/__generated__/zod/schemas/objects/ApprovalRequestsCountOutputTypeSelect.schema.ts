import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  maintenanceLogs: z.boolean().optional()
}).strict();
export const ApprovalRequestsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ApprovalRequestsCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ApprovalRequestsCountOutputTypeSelect>;
export const ApprovalRequestsCountOutputTypeSelectObjectZodSchema = makeSchema();

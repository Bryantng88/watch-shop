import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  MaintenanceRecord: z.boolean().optional(),
  Notification: z.boolean().optional(),
  ServiceRequest: z.boolean().optional(),
  TechnicalIssue: z.boolean().optional(),
  roles: z.boolean().optional()
}).strict();
export const UserCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserCountOutputTypeSelect>;
export const UserCountOutputTypeSelectObjectZodSchema = makeSchema();

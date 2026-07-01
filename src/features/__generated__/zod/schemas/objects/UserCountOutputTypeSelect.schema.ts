import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  maintenanceRecord: z.boolean().optional(),
  notification: z.boolean().optional(),
  serviceRequest: z.boolean().optional(),
  technicalIssue: z.boolean().optional(),
  roles: z.boolean().optional(),
  createdTasks: z.boolean().optional(),
  assignedTasks: z.boolean().optional(),
  completedTasks: z.boolean().optional(),
  cancelledTasks: z.boolean().optional(),
  raisedWorkCases: z.boolean().optional(),
  assignedWorkCases: z.boolean().optional(),
  workCaseActivities: z.boolean().optional(),
  taskExecution: z.boolean().optional(),
  assignedTaskItems: z.boolean().optional(),
  taskItems: z.boolean().optional(),
  taskItemActivities: z.boolean().optional(),
  activityReplies: z.boolean().optional()
}).strict();
export const UserCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserCountOutputTypeSelect>;
export const UserCountOutputTypeSelectObjectZodSchema = makeSchema();

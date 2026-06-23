import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './CustomerOrderByWithRelationInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { NotificationOrderByRelationAggregateInputObjectSchema as NotificationOrderByRelationAggregateInputObjectSchema } from './NotificationOrderByRelationAggregateInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema';
import { TechnicalIssueOrderByRelationAggregateInputObjectSchema as TechnicalIssueOrderByRelationAggregateInputObjectSchema } from './TechnicalIssueOrderByRelationAggregateInput.schema';
import { RoleOrderByRelationAggregateInputObjectSchema as RoleOrderByRelationAggregateInputObjectSchema } from './RoleOrderByRelationAggregateInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { WorkCaseOrderByRelationAggregateInputObjectSchema as WorkCaseOrderByRelationAggregateInputObjectSchema } from './WorkCaseOrderByRelationAggregateInput.schema';
import { WorkCaseActivityOrderByRelationAggregateInputObjectSchema as WorkCaseActivityOrderByRelationAggregateInputObjectSchema } from './WorkCaseActivityOrderByRelationAggregateInput.schema';
import { TaskExecutionOrderByRelationAggregateInputObjectSchema as TaskExecutionOrderByRelationAggregateInputObjectSchema } from './TaskExecutionOrderByRelationAggregateInput.schema';
import { TaskItemOrderByRelationAggregateInputObjectSchema as TaskItemOrderByRelationAggregateInputObjectSchema } from './TaskItemOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  passwordHash: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  avatarUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  roleId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  notification: z.lazy(() => NotificationOrderByRelationAggregateInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputObjectSchema).optional(),
  roles: z.lazy(() => RoleOrderByRelationAggregateInputObjectSchema).optional(),
  createdTasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  assignedTasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  completedTasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  cancelledTasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  raisedWorkCases: z.lazy(() => WorkCaseOrderByRelationAggregateInputObjectSchema).optional(),
  assignedWorkCases: z.lazy(() => WorkCaseOrderByRelationAggregateInputObjectSchema).optional(),
  workCaseActivities: z.lazy(() => WorkCaseActivityOrderByRelationAggregateInputObjectSchema).optional(),
  taskExecution: z.lazy(() => TaskExecutionOrderByRelationAggregateInputObjectSchema).optional(),
  assignedTaskItems: z.lazy(() => TaskItemOrderByRelationAggregateInputObjectSchema).optional(),
  taskItems: z.lazy(() => TaskItemOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const UserOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserOrderByWithRelationInput>;
export const UserOrderByWithRelationInputObjectZodSchema = makeSchema();

import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './objects/TaskInclude.schema';
import { TaskOrderByWithRelationInputObjectSchema as TaskOrderByWithRelationInputObjectSchema } from './objects/TaskOrderByWithRelationInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';
import { TaskScalarFieldEnumSchema } from './enums/TaskScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskFindManySelectSchema: z.ZodType<Prisma.TaskSelect> = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    source: z.boolean().optional(),
    kind: z.boolean().optional(),
    status: z.boolean().optional(),
    priority: z.boolean().optional(),
    dueAt: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    cancelledAt: z.boolean().optional(),
    createdByUserId: z.boolean().optional(),
    assignedToUserId: z.boolean().optional(),
    completedByUserId: z.boolean().optional(),
    cancelledByUserId: z.boolean().optional(),
    watchId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalIssueId: z.boolean().optional(),
    paymentId: z.boolean().optional(),
    taskTypeId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    createdByUser: z.boolean().optional(),
    assignedToUser: z.boolean().optional(),
    completedByUser: z.boolean().optional(),
    cancelledByUser: z.boolean().optional(),
    taskType: z.boolean().optional(),
    watch: z.boolean().optional(),
    order: z.boolean().optional(),
    shipment: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    technicalIssue: z.boolean().optional(),
    payment: z.boolean().optional(),
    notifications: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskSelect>;

export const TaskFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    source: z.boolean().optional(),
    kind: z.boolean().optional(),
    status: z.boolean().optional(),
    priority: z.boolean().optional(),
    dueAt: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    cancelledAt: z.boolean().optional(),
    createdByUserId: z.boolean().optional(),
    assignedToUserId: z.boolean().optional(),
    completedByUserId: z.boolean().optional(),
    cancelledByUserId: z.boolean().optional(),
    watchId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalIssueId: z.boolean().optional(),
    paymentId: z.boolean().optional(),
    taskTypeId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    createdByUser: z.boolean().optional(),
    assignedToUser: z.boolean().optional(),
    completedByUser: z.boolean().optional(),
    cancelledByUser: z.boolean().optional(),
    taskType: z.boolean().optional(),
    watch: z.boolean().optional(),
    order: z.boolean().optional(),
    shipment: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    technicalIssue: z.boolean().optional(),
    payment: z.boolean().optional(),
    notifications: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TaskFindManySchema: z.ZodType<Prisma.TaskFindManyArgs> = z.object({ select: TaskFindManySelectSchema.optional(), include: TaskIncludeObjectSchema.optional(), orderBy: z.union([TaskOrderByWithRelationInputObjectSchema, TaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskWhereInputObjectSchema.optional(), cursor: TaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskScalarFieldEnumSchema, TaskScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskFindManyArgs>;

export const TaskFindManyZodSchema = z.object({ select: TaskFindManySelectSchema.optional(), include: TaskIncludeObjectSchema.optional(), orderBy: z.union([TaskOrderByWithRelationInputObjectSchema, TaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskWhereInputObjectSchema.optional(), cursor: TaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskScalarFieldEnumSchema, TaskScalarFieldEnumSchema.array()]).optional() }).strict();
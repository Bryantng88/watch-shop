import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseIncludeObjectSchema as WorkCaseIncludeObjectSchema } from './objects/WorkCaseInclude.schema';
import { WorkCaseOrderByWithRelationInputObjectSchema as WorkCaseOrderByWithRelationInputObjectSchema } from './objects/WorkCaseOrderByWithRelationInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './objects/WorkCaseWhereUniqueInput.schema';
import { WorkCaseScalarFieldEnumSchema } from './enums/WorkCaseScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkCaseFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WorkCaseSelect> = z.object({
    id: z.boolean().optional(),
    refNo: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    scope: z.boolean().optional(),
    status: z.boolean().optional(),
    priority: z.boolean().optional(),
    watchId: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    raisedByUserId: z.boolean().optional(),
    assignedToUserId: z.boolean().optional(),
    triagedAt: z.boolean().optional(),
    resolvedAt: z.boolean().optional(),
    cancelledAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional(),
    order: z.boolean().optional(),
    shipment: z.boolean().optional(),
    category: z.boolean().optional(),
    raisedByUser: z.boolean().optional(),
    assignedToUser: z.boolean().optional(),
    tasks: z.boolean().optional(),
    serviceRequests: z.boolean().optional(),
    activities: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkCaseSelect>;

export const WorkCaseFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    refNo: z.boolean().optional(),
    title: z.boolean().optional(),
    description: z.boolean().optional(),
    scope: z.boolean().optional(),
    status: z.boolean().optional(),
    priority: z.boolean().optional(),
    watchId: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    raisedByUserId: z.boolean().optional(),
    assignedToUserId: z.boolean().optional(),
    triagedAt: z.boolean().optional(),
    resolvedAt: z.boolean().optional(),
    cancelledAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional(),
    order: z.boolean().optional(),
    shipment: z.boolean().optional(),
    category: z.boolean().optional(),
    raisedByUser: z.boolean().optional(),
    assignedToUser: z.boolean().optional(),
    tasks: z.boolean().optional(),
    serviceRequests: z.boolean().optional(),
    activities: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const WorkCaseFindFirstOrThrowSchema: z.ZodType<Prisma.WorkCaseFindFirstOrThrowArgs> = z.object({ select: WorkCaseFindFirstOrThrowSelectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), orderBy: z.union([WorkCaseOrderByWithRelationInputObjectSchema, WorkCaseOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseWhereInputObjectSchema.optional(), cursor: WorkCaseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkCaseScalarFieldEnumSchema, WorkCaseScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseFindFirstOrThrowArgs>;

export const WorkCaseFindFirstOrThrowZodSchema = z.object({ select: WorkCaseFindFirstOrThrowSelectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), orderBy: z.union([WorkCaseOrderByWithRelationInputObjectSchema, WorkCaseOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseWhereInputObjectSchema.optional(), cursor: WorkCaseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkCaseScalarFieldEnumSchema, WorkCaseScalarFieldEnumSchema.array()]).optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliveryIncludeObjectSchema as ProjectionEventDeliveryIncludeObjectSchema } from './objects/ProjectionEventDeliveryInclude.schema';
import { ProjectionEventDeliveryOrderByWithRelationInputObjectSchema as ProjectionEventDeliveryOrderByWithRelationInputObjectSchema } from './objects/ProjectionEventDeliveryOrderByWithRelationInput.schema';
import { ProjectionEventDeliveryWhereInputObjectSchema as ProjectionEventDeliveryWhereInputObjectSchema } from './objects/ProjectionEventDeliveryWhereInput.schema';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './objects/ProjectionEventDeliveryWhereUniqueInput.schema';
import { ProjectionEventDeliveryScalarFieldEnumSchema } from './enums/ProjectionEventDeliveryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProjectionEventDeliveryFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ProjectionEventDeliverySelect> = z.object({
    id: z.boolean().optional(),
    idempotencyKey: z.boolean().optional(),
    businessEventLogId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    effect: z.boolean().optional(),
    revokeEventKey: z.boolean().optional(),
    targetAliasIds: z.boolean().optional(),
    eventInstanceId: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    status: z.boolean().optional(),
    attempts: z.boolean().optional(),
    nextAttemptAt: z.boolean().optional(),
    lockedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    lastError: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    businessEventLog: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliverySelect>;

export const ProjectionEventDeliveryFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    idempotencyKey: z.boolean().optional(),
    businessEventLogId: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    effect: z.boolean().optional(),
    revokeEventKey: z.boolean().optional(),
    targetAliasIds: z.boolean().optional(),
    eventInstanceId: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    status: z.boolean().optional(),
    attempts: z.boolean().optional(),
    nextAttemptAt: z.boolean().optional(),
    lockedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    lastError: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    businessEventLog: z.boolean().optional()
  }).strict();

export const ProjectionEventDeliveryFindFirstOrThrowSchema: z.ZodType<Prisma.ProjectionEventDeliveryFindFirstOrThrowArgs> = z.object({ select: ProjectionEventDeliveryFindFirstOrThrowSelectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), orderBy: z.union([ProjectionEventDeliveryOrderByWithRelationInputObjectSchema, ProjectionEventDeliveryOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProjectionEventDeliveryWhereInputObjectSchema.optional(), cursor: ProjectionEventDeliveryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProjectionEventDeliveryScalarFieldEnumSchema, ProjectionEventDeliveryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryFindFirstOrThrowArgs>;

export const ProjectionEventDeliveryFindFirstOrThrowZodSchema = z.object({ select: ProjectionEventDeliveryFindFirstOrThrowSelectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), orderBy: z.union([ProjectionEventDeliveryOrderByWithRelationInputObjectSchema, ProjectionEventDeliveryOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProjectionEventDeliveryWhereInputObjectSchema.optional(), cursor: ProjectionEventDeliveryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProjectionEventDeliveryScalarFieldEnumSchema, ProjectionEventDeliveryScalarFieldEnumSchema.array()]).optional() }).strict();
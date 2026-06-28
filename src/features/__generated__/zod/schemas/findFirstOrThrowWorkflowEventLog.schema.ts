import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowEventLogOrderByWithRelationInputObjectSchema as WorkflowEventLogOrderByWithRelationInputObjectSchema } from './objects/WorkflowEventLogOrderByWithRelationInput.schema';
import { WorkflowEventLogWhereInputObjectSchema as WorkflowEventLogWhereInputObjectSchema } from './objects/WorkflowEventLogWhereInput.schema';
import { WorkflowEventLogWhereUniqueInputObjectSchema as WorkflowEventLogWhereUniqueInputObjectSchema } from './objects/WorkflowEventLogWhereUniqueInput.schema';
import { WorkflowEventLogScalarFieldEnumSchema } from './enums/WorkflowEventLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkflowEventLogFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WorkflowEventLogSelect> = z.object({
    id: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogSelect>;

export const WorkflowEventLogFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    eventKey: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict();

export const WorkflowEventLogFindFirstOrThrowSchema: z.ZodType<Prisma.WorkflowEventLogFindFirstOrThrowArgs> = z.object({ select: WorkflowEventLogFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([WorkflowEventLogOrderByWithRelationInputObjectSchema, WorkflowEventLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowEventLogWhereInputObjectSchema.optional(), cursor: WorkflowEventLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowEventLogScalarFieldEnumSchema, WorkflowEventLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowEventLogFindFirstOrThrowArgs>;

export const WorkflowEventLogFindFirstOrThrowZodSchema = z.object({ select: WorkflowEventLogFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([WorkflowEventLogOrderByWithRelationInputObjectSchema, WorkflowEventLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkflowEventLogWhereInputObjectSchema.optional(), cursor: WorkflowEventLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkflowEventLogScalarFieldEnumSchema, WorkflowEventLogScalarFieldEnumSchema.array()]).optional() }).strict();
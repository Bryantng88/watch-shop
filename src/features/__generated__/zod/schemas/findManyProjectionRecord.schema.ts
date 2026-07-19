import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordOrderByWithRelationInputObjectSchema as ProjectionRecordOrderByWithRelationInputObjectSchema } from './objects/ProjectionRecordOrderByWithRelationInput.schema';
import { ProjectionRecordWhereInputObjectSchema as ProjectionRecordWhereInputObjectSchema } from './objects/ProjectionRecordWhereInput.schema';
import { ProjectionRecordWhereUniqueInputObjectSchema as ProjectionRecordWhereUniqueInputObjectSchema } from './objects/ProjectionRecordWhereUniqueInput.schema';
import { ProjectionRecordScalarFieldEnumSchema } from './enums/ProjectionRecordScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProjectionRecordFindManySelectSchema: z.ZodType<Prisma.ProjectionRecordSelect> = z.object({
    id: z.boolean().optional(),
    projectionKey: z.boolean().optional(),
    projectionVersion: z.boolean().optional(),
    rowKey: z.boolean().optional(),
    workspaceId: z.boolean().optional(),
    spaceId: z.boolean().optional(),
    entityType: z.boolean().optional(),
    entityId: z.boolean().optional(),
    status: z.boolean().optional(),
    searchText: z.boolean().optional(),
    sortAt: z.boolean().optional(),
    dataJson: z.boolean().optional(),
    sourceUpdatedAt: z.boolean().optional(),
    projectedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordSelect>;

export const ProjectionRecordFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    projectionKey: z.boolean().optional(),
    projectionVersion: z.boolean().optional(),
    rowKey: z.boolean().optional(),
    workspaceId: z.boolean().optional(),
    spaceId: z.boolean().optional(),
    entityType: z.boolean().optional(),
    entityId: z.boolean().optional(),
    status: z.boolean().optional(),
    searchText: z.boolean().optional(),
    sortAt: z.boolean().optional(),
    dataJson: z.boolean().optional(),
    sourceUpdatedAt: z.boolean().optional(),
    projectedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const ProjectionRecordFindManySchema: z.ZodType<Prisma.ProjectionRecordFindManyArgs> = z.object({ select: ProjectionRecordFindManySelectSchema.optional(),  orderBy: z.union([ProjectionRecordOrderByWithRelationInputObjectSchema, ProjectionRecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProjectionRecordWhereInputObjectSchema.optional(), cursor: ProjectionRecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProjectionRecordScalarFieldEnumSchema, ProjectionRecordScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordFindManyArgs>;

export const ProjectionRecordFindManyZodSchema = z.object({ select: ProjectionRecordFindManySelectSchema.optional(),  orderBy: z.union([ProjectionRecordOrderByWithRelationInputObjectSchema, ProjectionRecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProjectionRecordWhereInputObjectSchema.optional(), cursor: ProjectionRecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProjectionRecordScalarFieldEnumSchema, ProjectionRecordScalarFieldEnumSchema.array()]).optional() }).strict();
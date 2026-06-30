import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TimelineEntryOrderByWithRelationInputObjectSchema as TimelineEntryOrderByWithRelationInputObjectSchema } from './objects/TimelineEntryOrderByWithRelationInput.schema';
import { TimelineEntryWhereInputObjectSchema as TimelineEntryWhereInputObjectSchema } from './objects/TimelineEntryWhereInput.schema';
import { TimelineEntryWhereUniqueInputObjectSchema as TimelineEntryWhereUniqueInputObjectSchema } from './objects/TimelineEntryWhereUniqueInput.schema';
import { TimelineEntryScalarFieldEnumSchema } from './enums/TimelineEntryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TimelineEntryFindFirstOrThrowSelectSchema: z.ZodType<Prisma.TimelineEntrySelect> = z.object({
    id: z.boolean().optional(),
    containerType: z.boolean().optional(),
    containerId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    sourceId: z.boolean().optional(),
    occurredAt: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    title: z.boolean().optional(),
    bodySnapshot: z.boolean().optional(),
    visibility: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TimelineEntrySelect>;

export const TimelineEntryFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    containerType: z.boolean().optional(),
    containerId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    sourceId: z.boolean().optional(),
    occurredAt: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    title: z.boolean().optional(),
    bodySnapshot: z.boolean().optional(),
    visibility: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const TimelineEntryFindFirstOrThrowSchema: z.ZodType<Prisma.TimelineEntryFindFirstOrThrowArgs> = z.object({ select: TimelineEntryFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([TimelineEntryOrderByWithRelationInputObjectSchema, TimelineEntryOrderByWithRelationInputObjectSchema.array()]).optional(), where: TimelineEntryWhereInputObjectSchema.optional(), cursor: TimelineEntryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TimelineEntryScalarFieldEnumSchema, TimelineEntryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TimelineEntryFindFirstOrThrowArgs>;

export const TimelineEntryFindFirstOrThrowZodSchema = z.object({ select: TimelineEntryFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([TimelineEntryOrderByWithRelationInputObjectSchema, TimelineEntryOrderByWithRelationInputObjectSchema.array()]).optional(), where: TimelineEntryWhereInputObjectSchema.optional(), cursor: TimelineEntryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TimelineEntryScalarFieldEnumSchema, TimelineEntryScalarFieldEnumSchema.array()]).optional() }).strict();
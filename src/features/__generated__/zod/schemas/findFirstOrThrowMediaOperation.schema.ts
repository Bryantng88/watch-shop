import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './objects/MediaOperationInclude.schema';
import { MediaOperationOrderByWithRelationInputObjectSchema as MediaOperationOrderByWithRelationInputObjectSchema } from './objects/MediaOperationOrderByWithRelationInput.schema';
import { MediaOperationWhereInputObjectSchema as MediaOperationWhereInputObjectSchema } from './objects/MediaOperationWhereInput.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './objects/MediaOperationWhereUniqueInput.schema';
import { MediaOperationScalarFieldEnumSchema } from './enums/MediaOperationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MediaOperationFindFirstOrThrowSelectSchema: z.ZodType<Prisma.MediaOperationSelect> = z.object({
    id: z.boolean().optional(),
    idempotencyKey: z.boolean().optional(),
    mediaObjectId: z.boolean().optional(),
    type: z.boolean().optional(),
    status: z.boolean().optional(),
    sourceKey: z.boolean().optional(),
    destinationKey: z.boolean().optional(),
    attempts: z.boolean().optional(),
    lastError: z.boolean().optional(),
    requestedByUserId: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    mediaObject: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MediaOperationSelect>;

export const MediaOperationFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    idempotencyKey: z.boolean().optional(),
    mediaObjectId: z.boolean().optional(),
    type: z.boolean().optional(),
    status: z.boolean().optional(),
    sourceKey: z.boolean().optional(),
    destinationKey: z.boolean().optional(),
    attempts: z.boolean().optional(),
    lastError: z.boolean().optional(),
    requestedByUserId: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    mediaObject: z.boolean().optional()
  }).strict();

export const MediaOperationFindFirstOrThrowSchema: z.ZodType<Prisma.MediaOperationFindFirstOrThrowArgs> = z.object({ select: MediaOperationFindFirstOrThrowSelectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), orderBy: z.union([MediaOperationOrderByWithRelationInputObjectSchema, MediaOperationOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaOperationWhereInputObjectSchema.optional(), cursor: MediaOperationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaOperationScalarFieldEnumSchema, MediaOperationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationFindFirstOrThrowArgs>;

export const MediaOperationFindFirstOrThrowZodSchema = z.object({ select: MediaOperationFindFirstOrThrowSelectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), orderBy: z.union([MediaOperationOrderByWithRelationInputObjectSchema, MediaOperationOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaOperationWhereInputObjectSchema.optional(), cursor: MediaOperationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaOperationScalarFieldEnumSchema, MediaOperationScalarFieldEnumSchema.array()]).optional() }).strict();
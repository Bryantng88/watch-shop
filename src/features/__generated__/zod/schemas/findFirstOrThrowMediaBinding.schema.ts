import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingIncludeObjectSchema as MediaBindingIncludeObjectSchema } from './objects/MediaBindingInclude.schema';
import { MediaBindingOrderByWithRelationInputObjectSchema as MediaBindingOrderByWithRelationInputObjectSchema } from './objects/MediaBindingOrderByWithRelationInput.schema';
import { MediaBindingWhereInputObjectSchema as MediaBindingWhereInputObjectSchema } from './objects/MediaBindingWhereInput.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './objects/MediaBindingWhereUniqueInput.schema';
import { MediaBindingScalarFieldEnumSchema } from './enums/MediaBindingScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MediaBindingFindFirstOrThrowSelectSchema: z.ZodType<Prisma.MediaBindingSelect> = z.object({
    id: z.boolean().optional(),
    mediaObjectId: z.boolean().optional(),
    ownerType: z.boolean().optional(),
    ownerId: z.boolean().optional(),
    role: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    audienceSegment: z.boolean().optional(),
    lifecycle: z.boolean().optional(),
    pipelineKey: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    mediaObject: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MediaBindingSelect>;

export const MediaBindingFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    mediaObjectId: z.boolean().optional(),
    ownerType: z.boolean().optional(),
    ownerId: z.boolean().optional(),
    role: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    audienceSegment: z.boolean().optional(),
    lifecycle: z.boolean().optional(),
    pipelineKey: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    mediaObject: z.boolean().optional()
  }).strict();

export const MediaBindingFindFirstOrThrowSchema: z.ZodType<Prisma.MediaBindingFindFirstOrThrowArgs> = z.object({ select: MediaBindingFindFirstOrThrowSelectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), orderBy: z.union([MediaBindingOrderByWithRelationInputObjectSchema, MediaBindingOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaBindingWhereInputObjectSchema.optional(), cursor: MediaBindingWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaBindingScalarFieldEnumSchema, MediaBindingScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingFindFirstOrThrowArgs>;

export const MediaBindingFindFirstOrThrowZodSchema = z.object({ select: MediaBindingFindFirstOrThrowSelectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), orderBy: z.union([MediaBindingOrderByWithRelationInputObjectSchema, MediaBindingOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaBindingWhereInputObjectSchema.optional(), cursor: MediaBindingWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaBindingScalarFieldEnumSchema, MediaBindingScalarFieldEnumSchema.array()]).optional() }).strict();
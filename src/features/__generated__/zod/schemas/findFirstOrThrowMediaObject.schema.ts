import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './objects/MediaObjectInclude.schema';
import { MediaObjectOrderByWithRelationInputObjectSchema as MediaObjectOrderByWithRelationInputObjectSchema } from './objects/MediaObjectOrderByWithRelationInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './objects/MediaObjectWhereInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './objects/MediaObjectWhereUniqueInput.schema';
import { MediaObjectScalarFieldEnumSchema } from './enums/MediaObjectScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MediaObjectFindFirstOrThrowSelectSchema: z.ZodType<Prisma.MediaObjectSelect> = z.object({
    id: z.boolean().optional(),
    bucket: z.boolean().optional(),
    storageKey: z.boolean().optional(),
    originalFileName: z.boolean().optional(),
    mimeType: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    checksum: z.boolean().optional(),
    etag: z.boolean().optional(),
    availability: z.boolean().optional(),
    verifiedAt: z.boolean().optional(),
    missingAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bindings: z.boolean().optional(),
    operations: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MediaObjectSelect>;

export const MediaObjectFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    bucket: z.boolean().optional(),
    storageKey: z.boolean().optional(),
    originalFileName: z.boolean().optional(),
    mimeType: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    checksum: z.boolean().optional(),
    etag: z.boolean().optional(),
    availability: z.boolean().optional(),
    verifiedAt: z.boolean().optional(),
    missingAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bindings: z.boolean().optional(),
    operations: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const MediaObjectFindFirstOrThrowSchema: z.ZodType<Prisma.MediaObjectFindFirstOrThrowArgs> = z.object({ select: MediaObjectFindFirstOrThrowSelectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), orderBy: z.union([MediaObjectOrderByWithRelationInputObjectSchema, MediaObjectOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaObjectWhereInputObjectSchema.optional(), cursor: MediaObjectWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaObjectScalarFieldEnumSchema, MediaObjectScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectFindFirstOrThrowArgs>;

export const MediaObjectFindFirstOrThrowZodSchema = z.object({ select: MediaObjectFindFirstOrThrowSelectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), orderBy: z.union([MediaObjectOrderByWithRelationInputObjectSchema, MediaObjectOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaObjectWhereInputObjectSchema.optional(), cursor: MediaObjectWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaObjectScalarFieldEnumSchema, MediaObjectScalarFieldEnumSchema.array()]).optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetOrderByWithRelationInputObjectSchema as MediaAssetOrderByWithRelationInputObjectSchema } from './objects/MediaAssetOrderByWithRelationInput.schema';
import { MediaAssetWhereInputObjectSchema as MediaAssetWhereInputObjectSchema } from './objects/MediaAssetWhereInput.schema';
import { MediaAssetWhereUniqueInputObjectSchema as MediaAssetWhereUniqueInputObjectSchema } from './objects/MediaAssetWhereUniqueInput.schema';
import { MediaAssetScalarFieldEnumSchema } from './enums/MediaAssetScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MediaAssetFindFirstOrThrowSelectSchema: z.ZodType<Prisma.MediaAssetSelect> = z.object({
    id: z.boolean().optional(),
    key: z.boolean().optional(),
    parentPrefix: z.boolean().optional(),
    fileName: z.boolean().optional(),
    ext: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    etag: z.boolean().optional(),
    lastModified: z.boolean().optional(),
    profile: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MediaAssetSelect>;

export const MediaAssetFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    key: z.boolean().optional(),
    parentPrefix: z.boolean().optional(),
    fileName: z.boolean().optional(),
    ext: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    etag: z.boolean().optional(),
    lastModified: z.boolean().optional(),
    profile: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const MediaAssetFindFirstOrThrowSchema: z.ZodType<Prisma.MediaAssetFindFirstOrThrowArgs> = z.object({ select: MediaAssetFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([MediaAssetOrderByWithRelationInputObjectSchema, MediaAssetOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaAssetWhereInputObjectSchema.optional(), cursor: MediaAssetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaAssetScalarFieldEnumSchema, MediaAssetScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetFindFirstOrThrowArgs>;

export const MediaAssetFindFirstOrThrowZodSchema = z.object({ select: MediaAssetFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([MediaAssetOrderByWithRelationInputObjectSchema, MediaAssetOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaAssetWhereInputObjectSchema.optional(), cursor: MediaAssetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaAssetScalarFieldEnumSchema, MediaAssetScalarFieldEnumSchema.array()]).optional() }).strict();
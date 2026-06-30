import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentOrderByWithRelationInputObjectSchema as UserCommentOrderByWithRelationInputObjectSchema } from './objects/UserCommentOrderByWithRelationInput.schema';
import { UserCommentWhereInputObjectSchema as UserCommentWhereInputObjectSchema } from './objects/UserCommentWhereInput.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';
import { UserCommentScalarFieldEnumSchema } from './enums/UserCommentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const UserCommentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.UserCommentSelect> = z.object({
    id: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    body: z.boolean().optional(),
    visibility: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.UserCommentSelect>;

export const UserCommentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    actorUserId: z.boolean().optional(),
    body: z.boolean().optional(),
    visibility: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const UserCommentFindFirstOrThrowSchema: z.ZodType<Prisma.UserCommentFindFirstOrThrowArgs> = z.object({ select: UserCommentFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([UserCommentOrderByWithRelationInputObjectSchema, UserCommentOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserCommentWhereInputObjectSchema.optional(), cursor: UserCommentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UserCommentScalarFieldEnumSchema, UserCommentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentFindFirstOrThrowArgs>;

export const UserCommentFindFirstOrThrowZodSchema = z.object({ select: UserCommentFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([UserCommentOrderByWithRelationInputObjectSchema, UserCommentOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserCommentWhereInputObjectSchema.optional(), cursor: UserCommentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([UserCommentScalarFieldEnumSchema, UserCommentScalarFieldEnumSchema.array()]).optional() }).strict();
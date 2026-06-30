import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentOrderByWithRelationInputObjectSchema as UserCommentOrderByWithRelationInputObjectSchema } from './objects/UserCommentOrderByWithRelationInput.schema';
import { UserCommentWhereInputObjectSchema as UserCommentWhereInputObjectSchema } from './objects/UserCommentWhereInput.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';
import { UserCommentCountAggregateInputObjectSchema as UserCommentCountAggregateInputObjectSchema } from './objects/UserCommentCountAggregateInput.schema';

export const UserCommentCountSchema: z.ZodType<Prisma.UserCommentCountArgs> = z.object({ orderBy: z.union([UserCommentOrderByWithRelationInputObjectSchema, UserCommentOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserCommentWhereInputObjectSchema.optional(), cursor: UserCommentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UserCommentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentCountArgs>;

export const UserCommentCountZodSchema = z.object({ orderBy: z.union([UserCommentOrderByWithRelationInputObjectSchema, UserCommentOrderByWithRelationInputObjectSchema.array()]).optional(), where: UserCommentWhereInputObjectSchema.optional(), cursor: UserCommentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), UserCommentCountAggregateInputObjectSchema ]).optional() }).strict();
import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';

export const UserCommentFindUniqueOrThrowSchema: z.ZodType<Prisma.UserCommentFindUniqueOrThrowArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserCommentFindUniqueOrThrowArgs>;

export const UserCommentFindUniqueOrThrowZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema }).strict();
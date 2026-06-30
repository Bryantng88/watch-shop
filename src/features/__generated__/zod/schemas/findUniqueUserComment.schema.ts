import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';

export const UserCommentFindUniqueSchema: z.ZodType<Prisma.UserCommentFindUniqueArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserCommentFindUniqueArgs>;

export const UserCommentFindUniqueZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema }).strict();
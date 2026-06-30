import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';

export const UserCommentDeleteOneSchema: z.ZodType<Prisma.UserCommentDeleteArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserCommentDeleteArgs>;

export const UserCommentDeleteOneZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema }).strict();
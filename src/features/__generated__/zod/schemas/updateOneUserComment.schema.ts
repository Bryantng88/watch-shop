import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentUpdateInputObjectSchema as UserCommentUpdateInputObjectSchema } from './objects/UserCommentUpdateInput.schema';
import { UserCommentUncheckedUpdateInputObjectSchema as UserCommentUncheckedUpdateInputObjectSchema } from './objects/UserCommentUncheckedUpdateInput.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';

export const UserCommentUpdateOneSchema: z.ZodType<Prisma.UserCommentUpdateArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(),  data: z.union([UserCommentUpdateInputObjectSchema, UserCommentUncheckedUpdateInputObjectSchema]), where: UserCommentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.UserCommentUpdateArgs>;

export const UserCommentUpdateOneZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(),  data: z.union([UserCommentUpdateInputObjectSchema, UserCommentUncheckedUpdateInputObjectSchema]), where: UserCommentWhereUniqueInputObjectSchema }).strict();
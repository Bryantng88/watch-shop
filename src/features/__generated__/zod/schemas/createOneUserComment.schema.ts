import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentCreateInputObjectSchema as UserCommentCreateInputObjectSchema } from './objects/UserCommentCreateInput.schema';
import { UserCommentUncheckedCreateInputObjectSchema as UserCommentUncheckedCreateInputObjectSchema } from './objects/UserCommentUncheckedCreateInput.schema';

export const UserCommentCreateOneSchema: z.ZodType<Prisma.UserCommentCreateArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(),  data: z.union([UserCommentCreateInputObjectSchema, UserCommentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.UserCommentCreateArgs>;

export const UserCommentCreateOneZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(),  data: z.union([UserCommentCreateInputObjectSchema, UserCommentUncheckedCreateInputObjectSchema]) }).strict();
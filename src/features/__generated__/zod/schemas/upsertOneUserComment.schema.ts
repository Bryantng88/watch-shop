import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentWhereUniqueInputObjectSchema as UserCommentWhereUniqueInputObjectSchema } from './objects/UserCommentWhereUniqueInput.schema';
import { UserCommentCreateInputObjectSchema as UserCommentCreateInputObjectSchema } from './objects/UserCommentCreateInput.schema';
import { UserCommentUncheckedCreateInputObjectSchema as UserCommentUncheckedCreateInputObjectSchema } from './objects/UserCommentUncheckedCreateInput.schema';
import { UserCommentUpdateInputObjectSchema as UserCommentUpdateInputObjectSchema } from './objects/UserCommentUpdateInput.schema';
import { UserCommentUncheckedUpdateInputObjectSchema as UserCommentUncheckedUpdateInputObjectSchema } from './objects/UserCommentUncheckedUpdateInput.schema';

export const UserCommentUpsertOneSchema: z.ZodType<Prisma.UserCommentUpsertArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema, create: z.union([ UserCommentCreateInputObjectSchema, UserCommentUncheckedCreateInputObjectSchema ]), update: z.union([ UserCommentUpdateInputObjectSchema, UserCommentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.UserCommentUpsertArgs>;

export const UserCommentUpsertOneZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(),  where: UserCommentWhereUniqueInputObjectSchema, create: z.union([ UserCommentCreateInputObjectSchema, UserCommentUncheckedCreateInputObjectSchema ]), update: z.union([ UserCommentUpdateInputObjectSchema, UserCommentUncheckedUpdateInputObjectSchema ]) }).strict();
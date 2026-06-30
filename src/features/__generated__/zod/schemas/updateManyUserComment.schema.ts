import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentUpdateManyMutationInputObjectSchema as UserCommentUpdateManyMutationInputObjectSchema } from './objects/UserCommentUpdateManyMutationInput.schema';
import { UserCommentWhereInputObjectSchema as UserCommentWhereInputObjectSchema } from './objects/UserCommentWhereInput.schema';

export const UserCommentUpdateManySchema: z.ZodType<Prisma.UserCommentUpdateManyArgs> = z.object({ data: UserCommentUpdateManyMutationInputObjectSchema, where: UserCommentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentUpdateManyArgs>;

export const UserCommentUpdateManyZodSchema = z.object({ data: UserCommentUpdateManyMutationInputObjectSchema, where: UserCommentWhereInputObjectSchema.optional() }).strict();
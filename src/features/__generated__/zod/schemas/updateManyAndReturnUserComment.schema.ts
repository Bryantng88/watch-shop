import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentUpdateManyMutationInputObjectSchema as UserCommentUpdateManyMutationInputObjectSchema } from './objects/UserCommentUpdateManyMutationInput.schema';
import { UserCommentWhereInputObjectSchema as UserCommentWhereInputObjectSchema } from './objects/UserCommentWhereInput.schema';

export const UserCommentUpdateManyAndReturnSchema: z.ZodType<Prisma.UserCommentUpdateManyAndReturnArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(), data: UserCommentUpdateManyMutationInputObjectSchema, where: UserCommentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentUpdateManyAndReturnArgs>;

export const UserCommentUpdateManyAndReturnZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(), data: UserCommentUpdateManyMutationInputObjectSchema, where: UserCommentWhereInputObjectSchema.optional() }).strict();
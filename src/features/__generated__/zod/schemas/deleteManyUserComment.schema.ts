import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentWhereInputObjectSchema as UserCommentWhereInputObjectSchema } from './objects/UserCommentWhereInput.schema';

export const UserCommentDeleteManySchema: z.ZodType<Prisma.UserCommentDeleteManyArgs> = z.object({ where: UserCommentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentDeleteManyArgs>;

export const UserCommentDeleteManyZodSchema = z.object({ where: UserCommentWhereInputObjectSchema.optional() }).strict();
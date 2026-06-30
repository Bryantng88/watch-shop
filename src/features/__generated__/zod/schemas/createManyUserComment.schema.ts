import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentCreateManyInputObjectSchema as UserCommentCreateManyInputObjectSchema } from './objects/UserCommentCreateManyInput.schema';

export const UserCommentCreateManySchema: z.ZodType<Prisma.UserCommentCreateManyArgs> = z.object({ data: z.union([ UserCommentCreateManyInputObjectSchema, z.array(UserCommentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentCreateManyArgs>;

export const UserCommentCreateManyZodSchema = z.object({ data: z.union([ UserCommentCreateManyInputObjectSchema, z.array(UserCommentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
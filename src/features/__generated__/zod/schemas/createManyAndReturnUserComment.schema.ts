import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { UserCommentSelectObjectSchema as UserCommentSelectObjectSchema } from './objects/UserCommentSelect.schema';
import { UserCommentCreateManyInputObjectSchema as UserCommentCreateManyInputObjectSchema } from './objects/UserCommentCreateManyInput.schema';

export const UserCommentCreateManyAndReturnSchema: z.ZodType<Prisma.UserCommentCreateManyAndReturnArgs> = z.object({ select: UserCommentSelectObjectSchema.optional(), data: z.union([ UserCommentCreateManyInputObjectSchema, z.array(UserCommentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.UserCommentCreateManyAndReturnArgs>;

export const UserCommentCreateManyAndReturnZodSchema = z.object({ select: UserCommentSelectObjectSchema.optional(), data: z.union([ UserCommentCreateManyInputObjectSchema, z.array(UserCommentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
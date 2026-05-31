import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './objects/PostTargetInclude.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './objects/PostTargetWhereUniqueInput.schema';
import { PostTargetCreateInputObjectSchema as PostTargetCreateInputObjectSchema } from './objects/PostTargetCreateInput.schema';
import { PostTargetUncheckedCreateInputObjectSchema as PostTargetUncheckedCreateInputObjectSchema } from './objects/PostTargetUncheckedCreateInput.schema';
import { PostTargetUpdateInputObjectSchema as PostTargetUpdateInputObjectSchema } from './objects/PostTargetUpdateInput.schema';
import { PostTargetUncheckedUpdateInputObjectSchema as PostTargetUncheckedUpdateInputObjectSchema } from './objects/PostTargetUncheckedUpdateInput.schema';

export const PostTargetUpsertOneSchema: z.ZodType<Prisma.PostTargetUpsertArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), where: PostTargetWhereUniqueInputObjectSchema, create: z.union([ PostTargetCreateInputObjectSchema, PostTargetUncheckedCreateInputObjectSchema ]), update: z.union([ PostTargetUpdateInputObjectSchema, PostTargetUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.PostTargetUpsertArgs>;

export const PostTargetUpsertOneZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), where: PostTargetWhereUniqueInputObjectSchema, create: z.union([ PostTargetCreateInputObjectSchema, PostTargetUncheckedCreateInputObjectSchema ]), update: z.union([ PostTargetUpdateInputObjectSchema, PostTargetUncheckedUpdateInputObjectSchema ]) }).strict();